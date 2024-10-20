import azure.cognitiveservices.speech as speechsdk
from config import SPEECH_KEY, SPEECH_REGION
import socketio
import console
from parser import parse_text_to_json

CURRENT_WAITER = ""


def recognized_handler(evt: speechsdk.SpeechRecognitionEventArgs):
    recognized_text = evt.result.text

    if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("current waiter", CURRENT_WAITER)
        is_waiter = "mesero" in recognized_text.lower()
        json = parse_text_to_json(recognized_text, "mesero" if is_waiter else "orden")
        print(json)
    #     if json["type"] == "waiter":
    #         # TODO: Validar el valor del mesero
    #         CURRENT_WAITER = json["data"]
    #         console.success("Mesero setted successfully: ", CURRENT_WAITER)
    #         return

    #     if json["type"] == "order":
    #         if CURRENT_WAITER == "":
    #             console.warn(
    #                 """
    #                     You should set the waiter before take the order
    #                         {"set mesero: 'nombre del mesero'"}
    #                 """
    #             )
    #         else:
    #             # TODO Emitir el evento
    #             return
    elif evt.result.reason == speechsdk.ResultReason.NoMatch:
        print("No se reconoció el habla.")
    elif evt.result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = evt.result.cancellation_details
        print(f"Reconocimiento cancelado: {cancellation_details.reason}")

    # if (
    #     evt.result.reason == speechsdk.ResultReason.RecognizedSpeech
    #     or evt.result.reason == speechsdk.ResultReason.RecognizingSpeech
    #     and evt.result.text.endsWith("final")
    # ):
    #     recognized_text = evt.result.text
    #

    # elif evt.result.reason == speechsdk.ResultReason.NoMatch:
    #     print("No se reconoció el habla.")
    # elif evt.result.reason == speechsdk.ResultReason.Canceled:
    #     cancellation_details = evt.result.cancellation_details
    #     print(f"Reconocimiento cancelado: {cancellation_details.reason}")


def recognize_real_time(
    sio: socketio.Client,
):

    speech_config = speechsdk.SpeechConfig(
        subscription=SPEECH_KEY, region=SPEECH_REGION
    )
    speech_config.speech_recognition_language = "es-MX"
    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)

    speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, audio_config=audio_config
    )

    speech_recognizer.recognizing.connect(recognized_handler)
    speech_recognizer.recognized.connect(recognized_handler)

    # speech_recognizer.session_started.connect(
    #     lambda evt: console.log(
    #         "Reconocimiento iniciado, Presiona Ctrl+C para detener.: {}".format(evt)
    #     )
    # )
    # speech_recognizer.session_stopped.connect(
    #     lambda evt: console.log("Reconocimiento detenido {}".format(evt))
    # )
    # speech_recognizer.canceled.connect(lambda evt: print("CANCELED {}".format(evt)))

    speech_recognizer.start_continuous_recognition()
    console.log("Reconocimiento iniciado, Presiona Ctrl+C para detener.")

    return speech_recognizer
