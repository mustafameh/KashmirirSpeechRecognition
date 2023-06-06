// Declare the variables that will hold the MediaRecorder object and the audio data
let mediaRecorder;
let recordedBlobs;

// Attach an event listener to the record button to start recording when it's clicked
document.getElementById('recordButton').addEventListener('click', startRecording);

// Function to start recording audio
function startRecording() {
    // Hide the record button
    document.getElementById('recordButton').style.display = 'none';

    // Initialize the countdown
    let countdownNumber = 3;
    let countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdownNumber;

    // Start the countdown
    let countdownInterval = setInterval(() => {
        countdownNumber--;
        countdownElement.textContent = countdownNumber;

        // Once the countdown reaches 0, start recording
        if (countdownNumber === 0) {
            // Stop the countdown
            clearInterval(countdownInterval);

            // Update the UI to show that recording has started
            countdownElement.textContent = 'Your voice is being recorded';
            document.getElementById('recordingIndicator').style.display = 'block';

            // Request access to the microphone and start recording
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                // Handle successful stream acquisition
                handleSuccess(stream);

                // Stop recording after 3 seconds
                setTimeout(endRecording, 3000);
            });
        }
    }, 1000);
}

// Function to handle successful stream acquisition
function handleSuccess(stream) {
    // Initialize the array that will hold the recorded audio data
    recordedBlobs = [];

    // Create a new MediaRecorder instance
    mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});

    // Specify what to do when audio data becomes available
    mediaRecorder.ondataavailable = (event) => {
        // If there's data available, add it to the array
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };

    // Start recording
    mediaRecorder.start(10); // A timeslice is passed to ensure data is available even for short clips
}

// Function to stop recording and send the audio data to the server
function endRecording() {
    mediaRecorder.stop();

    // When creating the Blob, use the same MIME type as the MediaRecorder
    const blob = new Blob(recordedBlobs, {type: 'audio/webm'});
    
    // Create a URL from the recorded Blob to be used as a source for the audio player
    const audioURL = URL.createObjectURL(blob);
    
    // Set the source of the audio player
    document.getElementById('audioPlayer').src = audioURL;

    const formData = new FormData();
    formData.append('audio_data', blob);
    fetch('/record', {
        method: 'POST',
        body: formData
    });

    // Reset the UI
    document.getElementById('recordingIndicator').style.display = 'none';
    document.getElementById('message').textContent = 'Voice Clip recorded';
    setTimeout(() => {
        document.getElementById('recordButton').style.display = 'inline-block';
        document.getElementById('message').textContent = '';
        document.getElementById('countdown').textContent = '';
    }, 3000);
}


