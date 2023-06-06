let mediaRecorder;
let recordedBlobs;

document.getElementById('recordButton').addEventListener('click', startRecording);

function startRecording() {
    document.getElementById('recordButton').style.display = 'none';
    let countdownNumber = 3;
    let countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdownNumber;

    let countdownInterval = setInterval(() => {
        countdownNumber--;
        countdownElement.textContent = countdownNumber;
        if (countdownNumber === 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = 'Your voice is being recorded';
            document.getElementById('recordingIndicator').style.display = 'block';

            // Start recording
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                handleSuccess(stream);
                // Move setTimeout to ensure handleSuccess has finished before endRecording is called
                setTimeout(endRecording, 2000); // 2 seconds recording
            });
        }
    }, 1000);
}


function handleSuccess(stream) {
    recordedBlobs = [];
    mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
    mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };
    mediaRecorder.start(10); // A timeslice is passed to ensure data is available even for short clips
}

function endRecording() {
    mediaRecorder.stop();

    // When creating the Blob, use the same MIME type as the MediaRecorder
    const blob = new Blob(recordedBlobs, {type: 'audio/webm'});
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
    }, 2000);
}
