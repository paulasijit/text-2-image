import gc
import random
import re
import sys
from pathlib import Path

import cv2
import matplotlib.pyplot as plt
import mediapy as media
import numpy as np
import pandas as pd
import requests
import spacy
import stanza
import torch
import tqdm
from diffusers import (
    EulerDiscreteScheduler,
    StableDiffusionPipeline,
    StableDiffusionXLPipeline,
    UNet2DConditionModel,
)
from googletrans import Translator
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
from spacy import displacy
from transformers import pipeline, set_seed

# Release GPU memory explicitly
torch.cuda.empty_cache()
gc.collect()


def has_alphabet(input_string):
    for char in input_string:
        if char.isalpha():
            return True  # If any character is alphabetic, return True
    return False  # If no alphabetic character is found, return False


has_alphabet("पेरिस में बारिश में हाथ में फूल लेकर नाचती एक लड़की|")


def irrelevant_input(text):
    # Regular expression patterns for URL, phone number, email, and numeric digits only
    # null_pattern = r""
    # num_pattern = r"[0-9]+"
    url_pattern = r"http[s]?:\/\/\S+"
    phone_pattern = r"\b(?:\d{3}[-.]?|\(\d{3}\) ?)\d{3}[-.]?\d{4}\b"
    email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"

    # Trim leading and trailing spaces from the text
    trimmed_text = text.strip()

    # Search for URLs, phone numbers, email addresses, and numeric digits/special characters only in the text
    # null_match = re.search(null_pattern, trimmed_text)
    # num_pattern = re.search(num_pattern,trimmed_text)
    url_match = re.search(url_pattern, trimmed_text)
    phone_match = re.search(phone_pattern, trimmed_text)
    email_match = re.search(email_pattern, trimmed_text)

    # Return False if any sensitive information or numeric digits only are found
    if not (has_alphabet(trimmed_text)) or url_match or phone_match or email_match:
        return False
    else:
        return True


print(irrelevant_input(""))
print(irrelevant_input("  "))
print(irrelevant_input("  10 apples  "))
print(irrelevant_input("https://google.com"))
print(irrelevant_input("9876123456"))
print(irrelevant_input("abc@ab.com"))
print(irrelevant_input("A girl dancing"))
print(irrelevant_input("पेरिस में बारिश में हाथ में फूल लेकर नाचती एक लड़की|"))


def get_translation(text, dest_lang):
    translator = Translator()
    translated_text = translator.translate(text, dest=dest_lang)
    return translated_text.text


get_translation("पेरिस में बारिश में हाथ में फूल लेकर नाचती एक लड़की|", "en")


def filtration_query(payload):
    API_URL = "https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation"
    headers = {"Authorization": "Bearer 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"}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


import requests


def filtration_query(payload):
    API_URL = "https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation"
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",  # Ensure the content type is set correctly
    }
    try:
        # Check if payload is correct (as a placeholder, you need to adjust based on API requirements)
        if "text" not in payload:
            return {
                "error": "Invalid payload",
                "message": "Payload must include a 'text' field.",
            }

        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()  # Raises a HTTPError for bad responses
        return response.json()
    except requests.exceptions.HTTPError as e:
        # More detailed error based on status code
        error_message = response.json().get("error", str(e))
        return {"error": error_message, "message": "HTTP error occurred"}
    except Exception as e:
        return {"error": str(e), "message": "An error occurred during the API call"}


# Example payload
payload = {"text": "example text to filter"}
print(filtration_query(payload))

filtration_query("A girl dancing with flowers in her hand in the rain in Paris.")


def is_content_appropriate(text):
    output = filtration_query({"inputs": text})

    positive_score = None
    negative_scores = 0
    # Iterate over the data and sum up scores for all labels except 'OK'
    for item in output[0]:
        if item["label"] == "OK":
            positive_score = item["score"]
        else:
            negative_scores += item["score"]

    print("Positve Content percentage:", positive_score)
    print("Negative Content percentage:", negative_scores)

    if negative_scores > positive_score:
        return False
    else:
        return True


# is_content_appropriate("A girl dancing with flowers in her hand in the rain in Paris.")

# is_content_appropriate("indian girl plucking tea in tea garden, Assam")


def syntactic_parsing_spacy(text):
    nlp = spacy.load("en_core_web_sm")
    print("******** POS Tagging ********")
    for token in nlp(text):
        print(token.text, "=>", token.pos_, "=>", token.tag_)

    print("\n******* Dependency Parsing ********")
    for token in nlp(text):
        print(token.text, "=>", token.dep_, "=>", token.head.text)

    print("\n******** Dependency Tree ********")
    options = {
        "compact": True,
        "bg": "lightyellow",
        "color": "darkblue",
        "font": "Source Sans Pro",
        "distance": 90,
    }
    displacy.render(nlp(text), style="dep", options=options, jupyter=True)


# syntactic_parsing_spacy("A girl dancing with flowers in her hand in the rain in Paris.")


def syntactic_parsing_stanza(text):
    nlp = stanza.Pipeline(
        "en"
    )  # download th English model and initialize an English neural pipeline
    print("\nPOS Tagging:")
    doc = nlp(text)  # run annotation over a sentence
    print(doc)

    print("\nSyntactic Parse:")
    nlp = stanza.Pipeline(lang="fr", processors="tokenize,mwt,pos,lemma,depparse")
    print(
        *[
            f'id: {word.id}\tword: {word.text}\thead id: {word.head}\thead: {sent.words[word.head-1].text if word.head > 0 else "root"}\
        \tdeprel: {word.deprel}'
            for sent in doc.sentences
            for word in sent.words
        ],
        sep="\n",
    )

    print("\nConstituency Parse:")
    nlp = stanza.Pipeline(lang="en", processors="tokenize,pos,constituency")
    for sentence in doc.sentences:
        print(sentence.constituency)


# syntactic_parsing_stanza(
#    "A girl dancing with flowers in her hand in the rain in Paris."
# )

# Commented out IPython magic to ensure Python compatibility.
# %%capture
# import nltk
# from nltk.wsd import lesk
# from nltk.tokenize import word_tokenize
#
# nltk.download('all')
# nltk.download('wordnet')
# nltk.download('punkt')
#
# !unzip /usr/share/nltk_data/corpora/wordnet.zip -d /usr/share/nltk_data/corpora/
# print(nltk.find('corpora/wordnet'))


def get_semantics_for_all_words(seq):
    # Tokenization of the sequence
    tokens = word_tokenize(seq)

    # Dictionary to store word and its corresponding sense definition
    word_senses = {}

    # Retrieving the definition of each token
    for token in tokens:
        sense = lesk(tokens, token)
        if sense:
            word_senses[token] = sense.definition()
        else:
            word_senses[token] = "No definition found"

    return word_senses


# Applying the function to all words in the sentence
# senses = get_semantics_for_all_words(
#    "A girl dancing with flowers in her hand in the rain in Paris."
# )

# Printing the results
# for word, definition in senses.items():
#    print(f"Word: {word}, Definition: {definition}")

# import nltk
# from nltk.corpus import wordnet
# from nltk.tokenize import word_tokenize

# Download necessary NLTK resources
# nltk.download("wordnet")
# nltk.download("punkt")


def print_wordnet_definitions(sentence):
    # Tokenize the sentence
    tokens = word_tokenize(sentence)

    # Iterate over each token and retrieve WordNet information
    for token in tokens:
        synsets = wordnet.synsets(token)
        if synsets:
            syn = synsets[0]  # Take the first synset
            print(f"Word: {token}")
            print(f"Synset name: {syn.name()}")
            print(f"Synset meaning: {syn.definition()}")
            examples = syn.examples()
            if examples:
                print(f"Synset example: {examples}")
            else:
                print("Synset example: None")
            print("\n")  # Print a newline for better readability between words
        else:
            print(f"Word: {token}")
            print("Synset name: None")
            print("Synset meaning: No definition found")
            print("Synset example: None\n")


# Applying the function to the sentence
# print_wordnet_definitions(
#    "A girl dancing with flowers in her hand in the rain in Paris."
# )

# import nltk
# from nltk.corpus import wordnet
# from nltk.tokenize import word_tokenize

# Download necessary NLTK resources
# nltk.download("wordnet")
# nltk.download("punkt")


def print_wordnet_relationships(sentence):
    # Tokenize the sentence
    tokens = word_tokenize(sentence)

    # Iterate over each token and retrieve WordNet relationships
    for token in tokens:
        synsets = wordnet.synsets(token)
        if synsets:
            syn = synsets[0]  # Take the first synset for simplicity
            print(f"Word: {token}")
            print(f"Synset name: {syn.name()}")
            print(f"Synset abstract term (Hypernyms): {syn.hypernyms()}")

            # Print specific terms (Hyponyms of the first Hypernym)
            if syn.hypernyms():
                print(
                    f"Synset specific term (Hyponyms of first Hypernym): {syn.hypernyms()[0].hyponyms()}"
                )
            else:
                print("No Hypernyms available.")

            # Print root hypernyms
            root_hypernyms = syn.root_hypernyms()
            print(f"Synset root hypernym: {root_hypernyms}\n")
        else:
            print(f"Word: {token}")
            print("No synset available.\n")


# Applying the function to the sentence
# print_wordnet_relationships(
#    "A girl dancing with flowers in her hand in the rain in Paris."
# )


def semantic_NER(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    for ent in doc.ents:
        print(ent.text, ent.label_)


# semantic_NER(
#    "Barack Obama, the former President of the United States, visited Paris, France to attend a conference organized by the United Nations. He met with representatives from the European Union and discussed climate change, healthcare, and international relations with them"
# )

# semantic_NER(
#    "A girl named Sanskriti working in Apple, buying apples at Gulmarg in Kashmir to make apple pie"
# )

# import nltk
# from gensim import corpora, models
# from nltk.corpus import stopwords


def topic_modelling(sentence):
    # Download and load stopwords
    nltk.download("stopwords")
    stop_words = set(stopwords.words("english"))

    # Tokenize the sentence and remove stopwords
    tokens = sentence.lower().split()
    tokens = [word for word in tokens if word not in stop_words]

    # Check if tokens are empty after removing stopwords
    if not tokens:
        print("No content left after removing stopwords.")
        return

    # Create a dictionary from the tokens
    dictionary = corpora.Dictionary([tokens])

    # Convert the tokens into a bag-of-words representation
    bow = dictionary.doc2bow(tokens)

    # Create the LDA model with 2 topics
    num_topics = 3  # Adjust the number of topics as needed
    lda_model = models.LdaModel(
        [bow], num_topics=num_topics, id2word=dictionary, passes=15, random_state=42
    )

    # Get the topics and display them
    topics = lda_model.print_topics(
        num_words=10
    )  # Adjust num_words to change number of words shown per topic
    print("Identified topics and their contributing words:")
    for topic_num, topic in topics:
        print(f"Topic {topic_num + 1}: {topic}")


# topic_modelling("A girl dancing with flowers in her hand in the rain in Paris.")


def masked_model(sentence):
    from transformers import pipeline

    nlp = pipeline("fill-mask")
    result = nlp(sentence)
    print(result)


# masked_model("The capital of France is <mask>.")

# masked_model("A girl dancing with flowers in her hand in the rain in <mask>.")


def pretrained_masked_model(sentence):
    from transformers import pipeline

    # Initialize the fill-mask pipeline with a pre-trained model
    nlp = pipeline("fill-mask", model="bert-base-uncased")
    # Perform the prediction
    results = nlp(sentence)

    # Print the results
    print("Predictions for the masked word:")
    for result in results:
        print(f"Token: {result['token_str']}, Score: {result['score']:.4f}")


# pretrained_masked_model("The capital of France is [MASK].")

# pretrained_masked_model(
#    "A girl dancing with flowers in her hand in the rain in [MASK], France."
# )


def semantic_query(payload):
    API_URL = "https://api-inference.huggingface.co/models/joeddav/distilbert-base-uncased-go-emotions-student"
    headers = {"Authorization": "Bearer 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"}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


# semantic_query("A girl dancing with flowers in her hand in the rain in Paris.")


def sentiment_visualisation(output):
    data = output[0]
    # Extract labels and scores
    labels = [item["label"] for item in data]
    scores = [item["score"] for item in data]

    # Define colors for positive and negative feelings
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


# sentiment_visualisation(
#    semantic_query("A girl dancing with flowers in her hand in the rain in Paris.")
# )


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


# sentiment_score(
#    semantic_query("A girl dancing with flowers in her hand in the rain in Paris.")
# )


def setup_models(use_lora=False, num_inference_steps=4):
    model_type = "lora" if use_lora else "unet"
    base = "stabilityai/stable-diffusion-xl-base-1.0"
    repo = "ByteDance/SDXL-Lightning"
    ckpt = f"sdxl_lightning_{num_inference_steps}step_{model_type}.safetensors"
    device = "mps"

    unet = UNet2DConditionModel.from_config(
        base,
        subfolder="unet",
    ).to(device, torch.float16)

    unet.load_state_dict(
        load_file(
            hf_hub_download(
                repo,
                ckpt,
            ),
            device=device,
        ),
    )

    pipe = StableDiffusionXLPipeline.from_pretrained(
        base,
        unet=unet,
        torch_dtype=torch.float16,
        use_safetensors=True,
        variant="fp16",
    ).to(device)

    if use_lora:
        pipe.load_lora_weights(hf_hub_download(repo, ckpt))
        pipe.fuse_lora()

    pipe.scheduler = EulerDiscreteScheduler.from_config(
        pipe.scheduler.config,
        timestep_spacing="trailing",
    )

    return pipe


def generate_images(
    pipe, prompt, negative_prompt="", num_inference_steps=4, guidance_scale=0.0
):
    seed = random.randint(0, sys.maxsize)

    images = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        guidance_scale=guidance_scale,
        num_inference_steps=num_inference_steps,
        generator=torch.Generator("mps").manual_seed(seed),
    ).images

    print(f"Prompt:\t{prompt}\nSeed:\t{seed}")
    media.show_images(images)
    images[0].save("output.jpg")
    return images[0]


#!pip install pyngrok
from pyngrok import conf, ngrok

conf.get_default().auth_token = "2bewHMmgJW0g9GgMvoM9fLbWjBC_3FNqoGM4WhRMMP35z1Wc4"

pipe = setup_models()

import base64
import io
import threading

from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from pyngrok import ngrok

app = Flask(__name__)
CORS(app)
port = "5000"


# Define Flask routes
@app.route("/")
def index():
    return "Hello from Colab!"


@app.route("/filtration-scores", methods=["POST"])
def get_filtration_scores():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    output = filtration_query({"inputs": translated_text})
    return jsonify({"filtration_scores": output})


@app.route("/sentiment-scores", methods=["POST"])
def get_sentiment_scores():
    payload = request.json
    translated_text = get_translation(payload.get("text"), "en")
    output = semantic_query({"inputs": translated_text})

    # positive_sentiment_percentage, negative_sentiment_percentage, positive_prob, sentiment_scores = sentiment_score(output)
    return jsonify({"sentiment_scores": output})


@app.route("/sentiment-scores-sum", methods=["POST"])
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


@app.route("/generate-image", methods=["POST"])
def generate_image():
    data = request.json

    # Extract parameters from the JSON data
    prompt = data.get("prompt")
    negative_prompt = data.get(
        "negative_prompt", ""
    )  # Default to empty string if not provided
    num_inference_steps = data.get(
        "num_inference_steps", 4
    )  # Default to 4 if not provided
    guidance_scale = data.get("guidance_scale", 0.0)  # Default to 0.0 if not provided

    translated_prompt = get_translation(prompt, "en")
    print(translated_prompt)
    translated_negative_prompt = get_translation(negative_prompt, "en")
    print(translated_negative_prompt)

    # if is_content_appropriate(translated_prompt):
    # Generate image
    image = generate_images(
        pipe,
        translated_prompt,
        translated_negative_prompt,
        num_inference_steps,
        guidance_scale,
    )

    # Convert PIL Image to bytes
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")
    image_bytes = image_bytes.getvalue()

    # Encode image bytes to base64
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    return jsonify({"image": encoded_image}), 200
    # else:
    #    return jsonify({"error": "Content is inappropriate."}), 400


# # Open a ngrok tunnel to the HTTP server
# public_url = ngrok.connect(port).public_url
# print(f" * ngrok tunnel \"{public_url}\" -> \"http://127.0.0.1:{port}\"")

# # Update any base URLs to use the public ngrok URL
# app.config["BASE_URL"] = public_url

# # Start the Flask server in a new thread
# threading.Thread(target=app.run, kwargs={"debug": True, "use_reloader": False}).start()

# Start the Flask server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
