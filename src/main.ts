import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';

liff.init({
    liffId: "1654373010-z8EJDM2V"
})
.then(() => {
    const video = document.createElement("video");
    const canvasElement : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    const canvas = <CanvasRenderingContext2D>canvasElement.getContext("2d");
    const loadingMessage = <HTMLDivElement>document.getElementById("loadingMessage");
    const outputContainer =  <HTMLDivElement>document.getElementById("output");
    const outputMessage = <HTMLDivElement>document.getElementById("outputMessage");
    const outputData = <HTMLSpanElement>document.getElementById("outputData");

    function drawLine(begin: Point, end: Point, color: string) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });

    function tick() {
      loadingMessage.innerText = "⌛ Loading video..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          outputMessage.hidden = true;
          if (outputData.parentElement != null) {
            outputData.parentElement.hidden = false;
          }
          outputData.innerText = code.data;
        } else {
          outputMessage.hidden = false;
          if (outputData.parentElement != null) {
            outputData.parentElement.hidden = true;
          }
        }
      }
      requestAnimationFrame(tick);
    }
});
