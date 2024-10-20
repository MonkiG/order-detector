from config import SERVER_URL
from recognize_real_time import recognize_real_time
from services.products_services import get_products
from services.waiters_services import get_waiters

import socketio
import console
import time


def retrying_service(number_tries: int, service):
    for attempt in range(number_tries):
        error, data = service()
        if error is None:
            return data
        else:
            console.warn(f"Intento {attempt + 1} fallido: {error}")
            if attempt < number_tries - 1:
                time.sleep(2)

    raise Exception(f"All the attempts ({number_tries}) failed")


def main():
    RETRYING_COUNT = 5
    console.log("Initilazing order detector")

    console.log("getting menu")
    products = retrying_service(RETRYING_COUNT, get_products)
    console.success("Products retrieved successfully")

    console.log("Getting waiters")
    waiters = retrying_service(RETRYING_COUNT, get_waiters)
    console.success("Waiters retrieved successfully")

    console.log("Connecting to server socket")
    sio = socketio.Client()
    sio.connect(SERVER_URL)
    console.success("Connected to server socket")
    speech_recognizer = recognize_real_time(sio)

    try:
        while True:
            time.sleep(0.5)
            pass
    except KeyboardInterrupt:
        console.warn("Stopping order detector.")
        speech_recognizer.stop_continuous_recognition()
        console.warn("Order detector stopped")

    sio.disconnect()
    console.warn("Disconnected from server socket")


if __name__ == "__main__":
    main()
