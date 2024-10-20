import requests
from config import SERVER_URL


def get_products():
    try:
        response = requests.get(f"{SERVER_URL}/product")
        data = response.json()
        return (None, data)
    except Exception as e:
        return (e, None)
