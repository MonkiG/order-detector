import requests
from config import SERVER_URL


def get_waiters():
    try:
        response = requests.get(f"{SERVER_URL}/waiter")
        data = response.json()
        return (None, data)
    except Exception as e:
        return (e, None)
