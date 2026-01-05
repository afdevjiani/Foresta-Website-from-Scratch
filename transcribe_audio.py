import speech_recognition as sr
from pydub import AudioSegment
import os

# Convert MP3 to WAV
audio = AudioSegment.from_mp3('d:/Foresta Website from Scratch/main audio.mp3')
audio.export('d:/Foresta Website from Scratch/temp_audio.wav', format='wav')

# Recognize speech
recognizer = sr.Recognizer()
with sr.AudioFile('d:/Foresta Website from Scratch/temp_audio.wav') as source:
    audio_data = recognizer.record(source)
    text = recognizer.recognize_google(audio_data)
    print('TRANSCRIPTION:')
    print(text)

# Cleanup
os.remove('d:/Foresta Website from Scratch/temp_audio.wav')
