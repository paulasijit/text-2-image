import base64
import hashlib
import json
from datetime import datetime, timedelta, timezone
import logging

import matplotlib.pyplot as plt
import pandas as pd
import pymysql
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    unset_jwt_cookies,
)
from googletrans import Translator
from userMixin import *

def create_users_table():
    connection = pymysql.connect(
    host="mysql-t2i", user="root", password="root", database="mysql"
)
    with connection.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        """)
    connection.commit()


def get_translation(text, dest_lang):
    translator = Translator()
    translated_text = translator.translate(text, dest=dest_lang)
    return translated_text.text


def filtration_query(payload):
    API_URL = "https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation"
    headers = {"Authorization": f"Bearer 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"}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


def semantic_query(payload):
    API_URL = "https://api-inference.huggingface.co/models/joeddav/distilbert-base-uncased-go-emotions-student"
    headers = {"Authorization": f"Bearer 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"}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


def sentiment_visualisation(output):
    data = output[0]
    labels = [item["label"] for item in data]
    scores = [item["score"] for item in data]

    colors = [
        (
            "green"
            if label
            in [
                "caring",
                "approval",
                "love",
                "gratitude",
                "realization",
                "pride",
                "joy",
                "optimism",
                "excitement",
                "relief",
                "amusement",
                "admiration",
            ]
            else "red"
        )
        for label in labels
    ]

    # Create bar graph
    plt.figure(figsize=(10, 6))
    plt.barh(labels, scores, color=colors)
    plt.xlabel("Score")
    plt.ylabel("Emotion Label")
    plt.title("Emotion Scores")
    plt.gca().invert_yaxis()  # Invert y-axis to display labels from top to bottom
    plt.show()


def sentiment_score(output):
    # Flatten the data list
    flat_data = [item for sublist in output for item in sublist]
    # Convert to DataFrame
    df = pd.DataFrame(flat_data)

    # Define lists for positive and negative feelings
    positive_feelings = [
        "admiration",
        "curiosity",
        "surprise",
        "amusement",
        "approval",
        "caring",
        "love",
        "gratitude",
        "realization",
        "desire",
        "pride",
        "joy",
        "optimism",
        "excitement",
        "relief",
        "neutral",
    ]
    negative_feelings = [
        "remorse",
        "nervousness",
        "confusion",
        "grief",
        "fear",
        "sadness",
        "embarrassment",
        "annoyance",
        "disapproval",
        "anger",
        "disgust",
        "disappointment",
    ]

    if "label" not in df.columns or "score" not in df.columns:
        print("Missing required columns in the data.")
        return 0, 0, 0, [{"error": "Missing required columns"}]

    try:
        # Calculate sum of scores for positive and negative feelings
        positive_sum = df[df["label"].isin(positive_feelings)]["score"].sum()
        negative_sum = df[df["label"].isin(negative_feelings)]["score"].sum()

        if positive_sum + negative_sum == 0:
            print("No sentiments data available to calculate percentages.")
            return 0, 0, 0, []

        # Calculate percentages
        positive_sentiment_percentage = (
            positive_sum / (positive_sum + negative_sum)
        ) * 100
        negative_sentiment_percentage = (
            negative_sum / (positive_sum + negative_sum)
        ) * 100

        # Calculate appropriateness score
        positive_prob = positive_sum / 16 - negative_sum / 12

        print("Positive Sentiment Percentage:", positive_sentiment_percentage)
        print("Negative Sentiment Percentage:", negative_sentiment_percentage)
        print("Appropriateness Score (-ve for inappropriate):", positive_prob)

        return (
            positive_sentiment_percentage,
            negative_sentiment_percentage,
            positive_prob,
            df.to_dict(orient="records"),
        )

    except Exception as e:
        print("An error occurred:", e)
        return None

def is_content_appropriate(text):
    output = filtration_query({"inputs": text})

    positive_score = None
    negative_scores = 0
    print(output)
    # Iterate over the data and sum up scores for all labels except 'OK'
    for item in output[0]:
        if item['label'] == 'OK':
            positive_score = item['score']
        else:
            negative_scores += item['score']

    print("Positve Content percentage:", positive_score)
    print("Negative Content percentage:", negative_scores)


    if(negative_scores > positive_score):
        return False
    else:
        return True

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
CORS(app)
app.config["JWT_SECRET_KEY"] = b'_5#y2L"F4Q8z\n\xec]/'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)
port = "5001"

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response


# Define Flask routes
@app.route("/")
def index():
    app.logger.info("Index page accessed")
    return "Hello from Colab!"


@app.route("/register", methods=["post"])
def registerPost():
    create_users_table()
    payload = request.json
    email = payload.get("email")
    password = payload.get("password")
    md5pass = hashlib.md5(password.encode())
    connection = pymysql.connect(host="mysql-t2i", user="root", password="root", database="mysql")
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users (email, password) VALUES (%s, %s)",
                (email, md5pass.hexdigest()),
            )
            connection.commit()
        app.logger.info("User registration successful for email: %s", email)
        return jsonify({"message": "User registration successful"})
    except pymysql.IntegrityError as e:
        if e.args[0] == 1062:
            app.logger.warning("User with email %s already exists", email)
            return jsonify({"error": "User with this email already exists"}), 400
        else:
            app.logger.error("Failed to register user: %s", str(e))
            return (
                jsonify({"error": "Failed to register user", "mysqlError": str(e)}),
                500,
            )
    except Exception as e:
        app.logger.error("Failed to register user: %s", str(e))
        return jsonify({"error": "Failed to register user", "mysqlError": str(e)}), 500
    finally:
        connection.close()


@app.route("/login", methods=["POST"])
def login_post():
    create_users_table()
    payload = request.json
    email = payload.get("email")
    app.logger.info("Login attempt for email: %s", email)
    password = payload.get("password")
    md5pass = hashlib.md5(password.encode())
    connection = pymysql.connect(host="mysql-t2i", user="root", password="root", database="mysql")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if user:
                user_id, stored_password = user[0], user[2]
                if md5pass.hexdigest() == stored_password:
                    access_token = create_access_token(identity=email)
                    app.logger.info("Login successful for email: %s", email)
                    return jsonify(
                        {
                            "message": "Login successful",
                            "user": email,
                            "token": access_token,
                        }
                    )
                else:
                    app.logger.warning("Incorrect password for email: %s", email)
                    return jsonify({"error": "Incorrect password"}), 401
            else:
                app.logger.warning("Email is not registered: %s", email)
                return jsonify({"error": "Email is not registered"}), 401
    except Exception as e:
        app.logger.error("Failed to log in: %s", str(e))
        return jsonify({"error": "Failed to log in", "mysqlError": str(e)}), 500
    finally:
        connection.close()


@app.route("/logout")
@jwt_required()
def logout():
    email = get_jwt_identity()
    app.logger.info("Logout request for email: %s", email)
    unset_jwt_cookies()
    return jsonify({"message": "Logged out successfully"})


@app.route("/filtration-scores", methods=["POST"])
@jwt_required()
def get_filtration_scores():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    app.logger.info("Filtration scores requested for text: %s", translated_text)
    output = filtration_query({"inputs": translated_text})
    if(len(output[0])):
        return jsonify({"filtration_scores": output})
    else:
        app.logger.error("Model not ready!")
        return jsonify({"error": "Model not ready. Try again!"}), 400


@app.route("/sentiment-scores", methods=["POST"])
@jwt_required()
def get_sentiment_scores():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    app.logger.info("Sentiment scores requested for text: %s", translated_text)
    output = semantic_query({"inputs": translated_text})
    return jsonify({"sentiment_scores": output})


@app.route("/translation", methods=["POST"])
@jwt_required()
def get_trans():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    app.logger.info("Translation requested for text: %s", translated_text)
    return jsonify({"translated_text": translated_text})


@app.route("/sentiment-scores-sum", methods=["POST"])
@jwt_required()
def get_sentiment_scores_sum():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    app.logger.info("Sentiment scores sum requested for text: %s", translated_text)
    output = semantic_query({"inputs": translated_text})

    (
        positive_sentiment_percentage,
        negative_sentiment_percentage,
        positive_prob,
        sentiment_scores,
    ) = sentiment_score(output)
    return jsonify(
        {
            "positive_sentiment_percentage": positive_sentiment_percentage,
            "negative_sentiment_percentage": negative_sentiment_percentage,
            "positive_score": positive_prob,
        }
    )


@app.route("/text2image", methods=["POST"])
@jwt_required()
def test():
    default_cfg_scale = 7
    default_steps = 30
    default_samples = 1
    data = request.json
    prompt = data.get("prompt")
    app.logger.info("Text-to-image conversion requested for prompt: %s", prompt)
    iFormat = data.get("format")
    cfg_scale = data.get("cfg_scale", default_cfg_scale)
    style_preset = data.get("style_preset")
    steps = data.get("steps", default_steps)
    samples = data.get("samples", default_samples)
    translated_text = get_translation(prompt, "en")

    valid_presets = [
        "3d-model",
        "analog-film",
        "anime",
        "cinematic",
        "comic-book",
        "digital-art",
        "enhance",
        "fantasy-art",
        "isometric",
        "line-art",
        "low-poly",
        "modeling-compound",
        "neon-punk",
        "origami",
        "photographic",
        "pixel-art",
        "tile-texture",
    ]

    if not translated_text:
        app.logger.warning("Prompt is required.")
        return jsonify({"error": "Prompt is required."}), 400
    
    if(is_content_appropriate(translated_text) != True):
        app.logger.error("Content is inappropriate.")
        return jsonify({"error": "Content is inappropriate."}), 400

    if style_preset and not style_preset in valid_presets:
        app.logger.warning(
            "Invalid value for 'style_preset': %s. Choose from the provided list of style presets: %s",
            style_preset,
            ", ".join(valid_presets),
        )
        return (
            jsonify(
                {
                    "error": f"Invalid value for 'style_preset'. Choose from the provided list of style presets: [{', '.join(valid_presets)}]."
                }
            ),
            400,
        )

    if "cfg_scale" in data:
        if not isinstance(cfg_scale, (int, float)) or not 0 <= cfg_scale <= 35:
            app.logger.warning(
                "Invalid value for 'cfg_scale': %s. It should be a number between 0 and 35.", cfg_scale)
            return (
                jsonify(
                    {
                        "error": "Invalid value for 'cfg_scale'. It should be a number between 0 and 35."
                    }
                ),
                400,
            )

    if "steps" in data:
        if not isinstance(steps, int) or not 10 <= steps <= 50:
            app.logger.warning(
                "Invalid value for 'steps': %s. It should be an integer between 10 and 50.", steps)
            return (
                jsonify(
                    {
                        "error": "Invalid value for 'steps'. It should be an integer between 10 and 50."
                    }
                ),
                400,
            )
    temp = []
    for i in range(samples):
        response = requests.post(
            "https://api.stability.ai/v2beta/stable-image/generate/sd3",
            headers={
                "authorization": "Bearer sk-AHSZWDe52CNFvYSubNxc2U7WVYzC62kaLNvCZ3apgxdLMLsN",
                "accept": "image/*",
            },
            files={"none": ""},
            data={
                "prompt": translated_text,
                "output_format": iFormat,
                "cfg_scale": cfg_scale,
                "steps": steps,
                "style_preset": style_preset,
                "samples": samples,
            },
        )
        if response.status_code == 200:
            image = response.content
            encoded_image = base64.b64encode(image).decode("utf-8")
            temp.append(encoded_image)
    if(len(temp)):
        return jsonify({"images": temp}), 200
    else:
        app.logger.error("Failed to generate image")
        return jsonify({"error": "Failed to generate image. Try again!"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
