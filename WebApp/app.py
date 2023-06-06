# Import the necessary modules
from flask import Flask, request, render_template
import os

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

# Run the Flask application
if __name__ == "__main__":
    app.run(port=5000)
