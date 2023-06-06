# Import the necessary modules
from flask import Flask, request, render_template
import os
from pydub import AudioSegment
from pydub.silence import detect_nonsilent

# Initialize a Flask application
app = Flask(__name__)

# Route for the home page
@app.route('/')
def home():
    # Render the home page
    return render_template('index.html')

# Route for handling the recording
@app.route('/record', methods=['POST'])
def record():
    # Retrieve the audio data from the request
    audio_file = request.files['audio_data']

    # Save the audio data as a .webm file
    audio_file.save('audio.webm')

    # Return a success response
    return "success", 200


@app.route('/convert', methods=['POST'])
def convert():
    audio_file = request.files['audio_data']
    audio_file.save('audio.webm')

    # Load webm file with PyDub (which uses ffmpeg)
    audio = AudioSegment.from_file('audio.webm', format="webm")

    # Detect nonsilent parts
    nonsilent_data = detect_nonsilent(audio, min_silence_len=1, silence_thresh=-15)

    if nonsilent_data:
        start_trim = nonsilent_data[0][0]
        end_trim = nonsilent_data[-1][1]
        trimmed_audio = audio[start_trim:end_trim]
    else:
        trimmed_audio = audio

    # Export as wav
    trimmed_audio.export('audio.wav', format='wav')

    return 'success', 200

# Run the Flask application
if __name__ == "__main__":
    app.run(port=5000)
