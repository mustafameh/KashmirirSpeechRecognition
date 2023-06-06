from flask import Flask, request
import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/record', methods=['POST'])
def record():
    audio_file = request.files['audio_data']
    audio_file.save('audio.webm')
    return "success", 200

if __name__ == "__main__":
    app.run(port=5000)

