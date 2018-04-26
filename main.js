var constraints = window.constraints = {
	video: true,
	audio: false
};

var localVideo = document.getElementById('localVideo');
//var startButton = document.getElementById('startButton');
//var stopButton = document.getElementById('hangupButton');

//startButton.addEventListener('click', startStream());
//stopButton.addEventListener('click', endStream());

function handleSuccess(stream) {
  window.stream = stream; // stream available to console
  localVideo.srcObject = stream;
}

function handleError(error) {
  console.log('getUserMedia error: ' + error.name, error);
}

function startStream () {
	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

function endStream () {
	localVideo.pause();
	localVideo.srcObject = null;
}