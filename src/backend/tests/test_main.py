import main
import pytest
from unittest.mock import patch
import json


# Test get_translation
@pytest.mark.parametrize(
    "text, dest_lang, expected_translation",
    [
        ("こんにちは", "en", "Hello"),
        ("안녕하세요", "en", "hello"),
        ("नमस्ते", "en", "hello"),
        ("你好", "en", "Hello"),
        ("ছবি", "en", "picture")
    ],
)
def test_get_translation(text, dest_lang, expected_translation):
    translated_text = main.get_translation(text, dest_lang)
    assert translated_text == expected_translation

# Test filtration_query (Mock external API call)
@patch("requests.post")
def test_filtration_query_mock(mock_post):
    mock_response_data = [{"label": "safe", "score": 0.95}]
    mock_post.return_value.json.return_value = mock_response_data

    payload = {"inputs": "This is a safe text"}
    response = main.filtration_query(payload)

    assert response == mock_response_data

# Test semantic_query (Mock external API call)
@patch("requests.post")
def test_semantic_query_mock(mock_post):
    mock_response_data = [[{"label": "joy", "score": 0.8}]]
    mock_post.return_value.json.return_value = mock_response_data

    payload = {"inputs": "This is a joyful text"}
    response = main.semantic_query(payload)

    assert response == mock_response_data

# Test sentiment_score
@pytest.mark.parametrize(
    "output, expected_positive, expected_negative, expected_score",
    [
        ([{"label": "joy", "score": 0.8}], 100, 0, 0.05),  # All positive
        ([{"label": "anger", "score": 0.9}], 0, 100, -0.075),  # All negative
        (
            [{"label": "joy", "score": 0.6}, {"label": "anger", "score": 0.4}],
            60,
            40,
            0.004166666666666666,
        ),  # Mixed
        ([], 0, 0, 0),  # Empty input
    ],
)
def test_sentiment_score(output, expected_positive, expected_negative, expected_score):
    positive_sentiment, negative_sentiment, positive_prob, _ = main.sentiment_score(
        [output]
    )
    assert positive_sentiment == expected_positive
    assert negative_sentiment == expected_negative
    assert positive_prob == expected_score
