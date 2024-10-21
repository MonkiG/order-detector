import azure.cognitiveservices.speech as speechsdk
from config import SPEECH_KEY, SPEECH_REGION
from app_sio import sio
import console
from parser import parse_text_to_json


CURRENT_WAITER = ""


def recognized_handler(evt: speechsdk.SpeechRecognitionEventArgs):
    global CURRENT_WAITER

    recognized_text = evt.result.text

    if evt.result.reason == speechsdk.ResultReason.NoMatch:
        print("No se reconoció el habla.")
        return

    if evt.result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = evt.result.cancellation_details
        print(f"Reconocimiento cancelado: {cancellation_details.reason}")
        return

    print("Waiter", CURRENT_WAITER)
    is_waiter = "mesero" in recognized_text.lower()
    json = parse_text_to_json(recognized_text, "mesero" if is_waiter else "orden")
    print(json)

    if json["type"] == "waiter":
        # TODO: Validar el valor del mesero
        CURRENT_WAITER = json["data"]
        console.success("Mesero setted successfully: ", CURRENT_WAITER)

    if json["type"] == "order" and CURRENT_WAITER == "":
        console.warn(
            """
            You should set the waiter before take the order
                    {"set mesero: 'nombre del mesero'"}
            """
        )
    elif json["type"] == "order":
        json["data"]["waiter"] = CURRENT_WAITER

        console.log("Enviando orden")
        sio.emit("add", json)
        console.success("Orden enviada")
    else:
        console.error("Unexpected error: ")
        console.error(json)


def recognize_real_time():

    speech_config = speechsdk.SpeechConfig(
        subscription=SPEECH_KEY, region=SPEECH_REGION
    )
    speech_config.speech_recognition_language = "es-MX"
    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)

    speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, audio_config=audio_config
    )

    speech_recognizer.recognized.connect(recognized_handler)
    speech_recognizer.start_continuous_recognition()
    # speech_recognizer.recognizing.connect(recognized_handler)
    console.log("Reconocimiento iniciado, Presiona Ctrl+C para detener.")

    return speech_recognizer
