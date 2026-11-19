import os
import requests
from dotenv import load_dotenv

load_dotenv()
backend_url = os.getenv('backend_url', 'http://localhost:3030')
sentiment_analyzer_url = os.getenv('sentiment_analyzer_url', 'http://localhost:5050/')


def get_request(endpoint, **kwargs):
    try:
        response = requests.get(f"{backend_url.rstrip('/')}/{endpoint.lstrip('/')}", params=kwargs or None, timeout=8)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return []


def analyze_review_sentiments(text):
    try:
        response = requests.get(f"{sentiment_analyzer_url.rstrip('/')}/analyze/{requests.utils.quote(text)}", timeout=8)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return {'sentiment': 'neutral'}


def post_review(data_dict):
    try:
        response = requests.post(f"{backend_url.rstrip('/')}/insert_review", json=data_dict, timeout=8)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return None
