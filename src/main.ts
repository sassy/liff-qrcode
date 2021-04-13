import jsQR from 'jsqr';
import liff from '@line/liff';

const canvasElement : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
const canvas = <CanvasRenderingContext2D>canvasElement.getContext("2d");
const outputMessage = <HTMLDivElement>document.getElementById("outputMessage");
const outputData = <HTMLSpanElement>document.getElementById("outputData");
const loadingMessage = <HTMLDivElement>document.getElementById("loadingMessage");
const outputContainer = <HTMLDivElement>document.getElementById("output");

const captureElement = <HTMLInputElement>document.getElementById('capture');
if (captureElement !== null) {
    loadingMessage.innerText = 'register...';
    captureElement.addEventListener('change', (event) => {
        outputContainer.hidden = false;
        loadingMessage.innerText = 'prepare...';
        const reader = new FileReader();
        reader.onload = () => {
            loadingMessage.innerText = 'loading...';
            const image = new Image();
            image.src = <string>reader.result
            image.onload = () => {
                canvas.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
                const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    loadingMessage.innerText = 'done';
                    outputMessage.hidden = true;
                    if (outputData.parentElement != null) {
                      outputData.parentElement.hidden = false;
                    }
                    outputData.innerText = code.data;
                  } else {
                    loadingMessage.innerText = 'fail';
                    outputMessage.hidden = false;
                    if (outputData.parentElement != null) {
                      outputData.parentElement.hidden = true;
                    }
                  }
            }
        };
        const target = <HTMLInputElement>event.target;
        if (target.files !== null) {
            const file = target.files[0];
            reader.readAsDataURL(file);
            loadingMessage.innerText = 'reading...';
        }
    }, true);    
}


liff.init({
    liffId: "1654373010-z8EJDM2V"
})
.then(() => {
    loadingMessage.innerText = 'ready...';
})
.catch((error) => {
    loadingMessage.innerText = error;
});
