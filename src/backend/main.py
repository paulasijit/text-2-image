import base64
import hashlib

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
from flask_login import (
    LoginManager,
    current_user,
    login_manager,
    login_required,
    login_user,
    logout_user,
)
from googletrans import Translator
from userMixin import *

# Database connection setup
connection = pymysql.connect(
    host="mysql-t2i", user="root", password="root", database="mysql"
)


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


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
CORS(app)
login_manager = LoginManager(app)
login_manager.login_message = "User needs to be logged in to view this page"
login_manager.login_message_category = "error"
port = "5001"


@login_manager.unauthorized_handler
def unauthorized_callback():
    return jsonify({"error": "User needs to be logged in to access this resource"}), 401


# Define Flask routes
@app.route("/")
def index():
    return "Hello from Colab!"


@login_manager.user_loader
def load_user(user_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()
        if user_data is None:
            return None
        else:
            return User(*user_data)


@app.route("/register", methods=["post"])
def registerPost():
    payload = request.json
    email = payload.get("email")
    password = payload.get("password")
    md5pass = hashlib.md5(password.encode())
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users (email, password) VALUES (%s, %s)",
                (email, md5pass.hexdigest()),
            )
            connection.commit()
        return jsonify({"message": "User registration successful"})
    except pymysql.IntegrityError as e:
        if e.args[0] == 1062:
            return jsonify({"error": "User with this email already exists"}), 400
        else:
            return (
                jsonify({"error": "Failed to register user", "mysqlError": str(e)}),
                500,
            )
    except Exception as e:
        return jsonify({"error": "Failed to register user", "mysqlError": str(e)}), 500


@app.route("/login", methods=["POST"])
def login_post():
    payload = request.json
    email = payload.get("email")
    password = payload.get("password")
    md5pass = hashlib.md5(password.encode())
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if user:
                user_id, stored_password = user[0], user[2]
                if md5pass.hexdigest() == stored_password:
                    Us = load_user(user_id)
                    login_user(Us)
                    return jsonify({"message": "Login successful", "user": email})
                else:
                    return jsonify({"error": "Incorrect password"}), 401
            else:
                return jsonify({"error": "Email is not registered"}), 401
    except Exception as e:
        return jsonify({"error": "Failed to log in", "mysqlError": str(e)}), 500


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"})


@app.route("/filtration-scores", methods=["POST"])
@login_required
def get_filtration_scores():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    output = filtration_query({"inputs": translated_text})
    return jsonify({"filtration_scores": output})


@app.route("/sentiment-scores", methods=["POST"])
@login_required
def get_sentiment_scores():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    output = semantic_query({"inputs": translated_text})
    return jsonify({"sentiment_scores": output})


@app.route("/translation", methods=["POST"])
@login_required
def get_trans():
    print(current_user.is_authenticated)
    if current_user.is_authenticated:
        payload = request.json
        translated_text = get_translation(payload.get("text"), "en")
        return jsonify({"translated_text": translated_text})
    return jsonify({"error": "User needs to be logged in to access this resource"}), 401


@app.route("/sentiment-scores-sum", methods=["POST"])
@login_required
def get_sentiment_scores_sum():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
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
@login_required
def test():
    default_cfg_scale = 7
    default_steps = 30
    data = request.json
    prompt = data.get("prompt")
    iFormat = data.get("format")
    cfg_scale = data.get("cfg_scale", default_cfg_scale)
    style_preset = data.get("style_preset")
    steps = data.get("steps", default_steps)

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

    if not prompt:
        return jsonify({"error": "Prompt is required."}), 400

    if style_preset and not style_preset in valid_presets:
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
            return (
                jsonify(
                    {
                        "error": "Invalid value for 'steps'. It should be an integer between 10 and 50."
                    }
                ),
                400,
            )

    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        headers={
            "authorization": "Bearer sk-AHSZWDe52CNFvYSubNxc2U7WVYzC62kaLNvCZ3apgxdLMLsN",
            "accept": "image/*",
        },
        files={"none": ""},
        data={
            "prompt": prompt,
            "output_format": iFormat,
            "cfg_scale": cfg_scale,
            "steps": steps,
            "style_preset": style_preset,
        },
    )
    if response.status_code == 200:
        image = response.content
        with open("./image.jpeg", "wb") as file:
            file.write(image)
        encoded_image = base64.b64encode(image).decode("utf-8")
        return jsonify({"image": encoded_image}), 200
    else:
        return jsonify({"error": "Content is inappropriate."}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
