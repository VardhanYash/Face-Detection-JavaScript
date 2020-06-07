const video = document.getElementById('video');

Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

// used to start the video playback on the web page
function startVideo() {
      navigator.getUserMedia(
            { video: {} },
            stream => video.srcObject = stream,
            err=> console.error(err)
      )
}

// detects the face and does shw
video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      const displaySize = {width: video.width, height: video.height};
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video,
                  new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                  const resizedDetections = faceapi.resizeResults(detections, displaySize);
                  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // clears the canvas so that video is live
                  faceapi.draw.drawDetections(canvas, resizedDetections); // draws the box around the face with a decimal value representing confidence that the image is a face
                  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); //draws the features of the face such as eyes and mouth that are being detected
                  faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // shows the emotion indicated by the face on the box, with a percent confidence as well
      }, 100);
});