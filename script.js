const video = document.getElementById("video");
const captureButton = document.getElementById("capture-btn");
const downloadButton = document.getElementById("download-btn");

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error("Camera access denied!", error);
    });

let photoCount = 0;

captureButton.addEventListener("click", function () {
    if (photoCount >= 4) {
        alert("Collage is full! Download or restart.");
        return;
    }

    let countdown = 3;
    captureButton.innerText = `📸 Capturing in ${countdown}s`;
    
    let timer = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(timer);
            takePhoto();
        } else {
            captureButton.innerText = `📸 Capturing in ${countdown}s`;
        }
    }, 1000);
});

function takePhoto() {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let frame = document.getElementById(`frame${photoCount + 1}`);
    frame.src = canvas.toDataURL("image/png");

    photoCount++;
    captureButton.innerText = "📸 Click Picture";
}

downloadButton.addEventListener("click", function () {
    if (photoCount < 4) {
        alert("Take all 4 photos before downloading.");
        return;
    }

    let collageCanvas = document.createElement("canvas");
    let context = collageCanvas.getContext("2d");
    
    let frameWidth = 300;
    let frameHeight = 300;
    collageCanvas.width = frameWidth * 2;
    collageCanvas.height = frameHeight * 2;

    let frames = [];
    for (let i = 1; i <= 4; i++) {
        let img = new Image();
        img.src = document.getElementById(`frame${i}`).src;
        frames.push(img);
    }

    frames[0].onload = function () {
        context.drawImage(frames[0], 0, 0, frameWidth, frameHeight);
        frames[1].onload = function () {
            context.drawImage(frames[1], frameWidth, 0, frameWidth, frameHeight);
            frames[2].onload = function () {
                context.drawImage(frames[2], 0, frameHeight, frameWidth, frameHeight);
                frames[3].onload = function () {
                    context.drawImage(frames[3], frameWidth, frameHeight, frameWidth, frameHeight);

                    let link = document.createElement("a");
                    link.href = collageCanvas.toDataURL("image/png");
                    link.download = "prettypix-collage.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
            };
        };
    };
});
