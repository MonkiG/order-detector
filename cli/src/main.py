from config import SPEECH_KEY, SPEECH_REGION, SERVER_URL
import azure.cognitiveservices.speech as speechsdk
import socketio

sio = socketio.Client()
sio.connect(SERVER_URL)

speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
speech_config.speech_recognition_language = "es-MX"

audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)

speech_recognizer = speechsdk.SpeechRecognizer(
    speech_config=speech_config, audio_config=audio_config
)


def recognized_handler(evt):
    if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
        # Acá se hace el envio a la base de datos con sio lul
        recognized_text = evt.result.text
        sio.emit("add", {"test": "hola-mundo-hehe"})
        print("Reconocido", recognized_text)

    elif evt.result.reason == speechsdk.ResultReason.NoMatch:
        print("No se reconoció el habla.")
    elif evt.result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = evt.result.cancellation_details
        print(f"Reconocimiento cancelado: {cancellation_details.reason}")


speech_recognizer.recognized.connect(recognized_handler)

print("Iniciando el reconocimiento continuo. Presiona Ctrl+C para detener.")
speech_recognizer.start_continuous_recognition()


try:
    while True:
        pass
except KeyboardInterrupt:
    print("Deteniendo el reconocimiento continuo.")
    speech_recognizer.stop_continuous_recognition()

sio.disconnect()
