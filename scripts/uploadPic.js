/* ===================== ELEMENTS ===================== */
const systemsCheck = document.querySelector(".systems-check");
const IDuploadContainer = document.querySelector(".Doc-upload-container");
const IDmainContainer = document.querySelector(".Doc-main-container");
const UploadPic = document.getElementById("UploadPic");
const IDimageUpload = document.getElementById("DocimageUpload");
const openCameraButton = document.getElementById("openCamera");
const savePhotoBtn = document.getElementById("Doc-photo-save");

let saveIDBtn = null;
let currentStream = null;

/* ===================== HELPERS ===================== */

function updateSystemsCheckBackground() {
  if (!systemsCheck) return;
  systemsCheck.style.backgroundColor =
    IDuploadContainer.querySelector("img") ? "#049b04" : "";
}

function stopCameraStream() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

function clearUploadContainer() {
  stopCameraStream();
  saveIDBtn = null;
  IDuploadContainer.innerHTML = "";
  IDmainContainer.innerHTML = "";
  IDuploadContainer.classList.remove("previewing");
  updateSystemsCheckBackground();
}

/* ===================== IMAGE VIEW ===================== */

function openImageInNewTab(imageDataUrl) {
  const newTab = window.open();
      $(newTab.document.head).html(`
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
        <title>View Image</title>
        <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
              position: fixed;
            }
            body {
              background-color: black;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .image-container {
              width: 70vw;
              height: 70vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              object-fit: contain;
              background-color: white;
            }
        </style>
    `);

    newTab.document.body.innerHTML = `
        <div class="image-container">
            <img src="${imageDataUrl}" alt="View Image">
        </div>
    `;

    var script = newTab.document.createElement("script");
    script.textContent = `
        function forceReflow() {
            document.body.style.display = 'none';
            document.body.offsetHeight; 
            document.body.style.display = 'flex';
            
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('orientationchange'));
        }
        
        setTimeout(forceReflow, 10);
        setTimeout(forceReflow, 100);
        setTimeout(forceReflow, 300);
        
        window.addEventListener('orientationchange', () => {
            setTimeout(forceReflow, 100);
        });
    `;
    newTab.document.body.appendChild(script);
}

function addImageClickHandler(img, url) {
  img.style.cursor = "pointer";
  img.title = "اضغط لفتح الصورة";
  img.addEventListener("click", () => openImageInNewTab(url));
}

/* ===================== REMOVE ICON ===================== */

function addRemoveIcon() {
  IDmainContainer.innerHTML = `
    <i class="fa-regular fa-circle-xmark xmark-icon" id="removeIDImg"></i>
  `;

  document.getElementById("removeIDImg").addEventListener("click", e => {
    e.preventDefault();
    clearUploadContainer();
  });
}

/* ===================== IMAGE PREVIEW ===================== */

function showPreviewImage(dataURL, id) {
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    img.id = id;
    img.classList.add("preview-image");

    IDuploadContainer.innerHTML = "";
    IDuploadContainer.appendChild(img);
    IDuploadContainer.classList.add("previewing");

    addImageClickHandler(img, dataURL);
    addRemoveIcon();
    updateSystemsCheckBackground();
  };

  img.src = dataURL;
}

/* ===================== UPLOAD HANDLER ===================== */

UploadPic.addEventListener("click", () => {
  saveIDBtn = "UploadPic";
  IDimageUpload.click();
});

IDimageUpload.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => showPreviewImage(e.target.result, "IDImage");
  reader.readAsDataURL(file);
});

/* ===================== CAMERA ===================== */

async function startCamera() {
  IDuploadContainer.innerHTML = `
    <video id="videoElement" autoplay playsinline></video>
  `;

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    document.getElementById("videoElement").srcObject = currentStream;
  } catch (err) {
    console.error("Camera error:", err);
    clearUploadContainer();
  }
}

function capturePhoto() {
  const video = document.getElementById("videoElement");
  if (!video) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  stopCameraStream();
  video.remove();

  const photoDataURL = canvas.toDataURL("image/png");
  saveIDBtn = "CameraID";
  showPreviewImage(photoDataURL, "photo");
}

openCameraButton.addEventListener("click", async () => {
  const video = document.getElementById("videoElement");
  video ? capturePhoto() : await startCamera();
});

/* ===================== SAVE ===================== */

function saveImageToBase64(img) {
  return new Promise((resolve, reject) => {
    if (!img.complete) {
      img.onload = () => saveImageToBase64(img).then(resolve);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    resolve(canvas.toDataURL("image/jpeg", 0.9));
  });
}

savePhotoBtn.addEventListener("click", async () => {
  if (!saveIDBtn) return;

  const img =
    saveIDBtn === "UploadPic"
      ? document.getElementById("IDImage")
      : document.getElementById("photo");

  if (!img) return;

  const base64 = await saveImageToBase64(img);
  console.log("Saved Base64:", base64);

  $("#Doc-photo-modal").modal("hide");
  updateSystemsCheckBackground();
});

/* ===================== INIT ===================== */

document.addEventListener("DOMContentLoaded", updateSystemsCheckBackground);
