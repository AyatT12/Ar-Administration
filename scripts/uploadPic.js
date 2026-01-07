const systemsCheck = document.querySelector(".systems-check");
const IDuploadContainer = document.querySelector(".Doc-upload-container");
const IDmainContainer = document.querySelector(".Doc-main-container");
const UploadPic = document.getElementById("UploadPic");
const IDimageUpload = document.getElementById("DocimageUpload");
const openCameraButton = document.getElementById("openCamera");

let saveIDBtn = null;
let currentStream = null; // Track active camera stream

// ===== FUNCTIONS =====

function updateSystemsCheckBackground() {
  if (IDuploadContainer && systemsCheck) {
    systemsCheck.style.backgroundColor = IDuploadContainer.querySelector("img")
      ? "green"
      : "";
  }
}

function openImageInNewTab(imageDataUrl) {
  const newTab = window.open();
  if (!newTab) {return;}

  $(newTab.document.head).html(`
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>عرض الصورة</title>
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
      }
      img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
      }
    </style>
  `);

  newTab.document.body.innerHTML = `
    <div class="image-container">
      <img src="${imageDataUrl}" alt="عرض الصورة">
    </div>
  `;
}

function addImageClickHandler(imgElement, imageUrl) {
  imgElement.style.cursor = "pointer";
  imgElement.title = "اضغط لفتح الصورة في نافذة جديدة";
  imgElement.addEventListener("click", () => openImageInNewTab(imageUrl));
}

function saveImageToBase64(imgElement) {
  return new Promise((resolve, reject) => {
    try {
      // Check if image is loaded
      if (!imgElement.complete || !imgElement.naturalWidth) {
        imgElement.onload = () => saveImageToBase64(imgElement).then(resolve).catch(reject);
        imgElement.onerror = () => reject(new Error("فشل تحميل الصورة"));
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, 0, 0);

      const base64 = canvas.toDataURL("image/jpeg", 0.9);
      console.log("Base64 generated successfully");
      resolve(base64);
    } catch (error) {
      console.error("Error converting image to base64:", error);
      reject(error);
    }
  });
}

function stopCameraStream() {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
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

// ===== IMAGE UPLOAD HANDLERS =====

async function convertHEICImage(file) {
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    return convertedBlob;
  } catch (err) {
    console.error("HEIC conversion failed:", err);
    throw new Error("فشل تحويل صورة HEIC، يرجى اختيار صورة بصيغة أخرى.");
  }
}

function isHEICFile(file) {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
}

function handleImagePreview(dataURL) {
  const IDpreviewImage = new Image();
  IDpreviewImage.crossOrigin = "Anonymous";
  
  IDpreviewImage.onload = function () {
    IDpreviewImage.classList.add("preview-image");
    IDpreviewImage.id = "IDImage";
    saveIDBtn = "UploadPic";
    
    addImageClickHandler(IDpreviewImage, dataURL);
    IDmainContainer.innerHTML = '<i class="fa-regular fa-circle-xmark xmark-icon"></i>';
    IDuploadContainer.innerHTML = "";
    IDuploadContainer.appendChild(IDpreviewImage);
    IDuploadContainer.classList.add("previewing");
    updateSystemsCheckBackground();
  };
  
  IDpreviewImage.onerror = function() {
    console.error("Failed to load image");
  };
  
  IDpreviewImage.src = dataURL;
}

// ===== EVENT LISTENERS =====

document.addEventListener("DOMContentLoaded", updateSystemsCheckBackground);

UploadPic.addEventListener("click", () => {
  IDimageUpload.click();
  saveIDBtn = "UploadPic";
});

IDimageUpload.addEventListener("change", async function () {
  const file = this.files[0];
  if (!file) return;

  try {
    let fileToProcess = file;

    // Convert HEIC if needed
    if (isHEICFile(file)) {
      fileToProcess = await convertHEICImage(file);
    }

    // Read and preview image
    const reader = new FileReader();
    reader.onload = (e) => handleImagePreview(e.target.result);
    reader.onerror = () => {
      console.error("Failed to read file");
    };
    reader.readAsDataURL(fileToProcess);
  } catch (error){}
});

document.getElementById("removeIDImg").addEventListener("click", function (e) {
  e.preventDefault();
  clearUploadContainer();
});

// ===== CAMERA HANDLERS =====

async function initializeCamera() {
  const cameraStrategies = [
    { video: { facingMode: { exact: "environment" } } },
    { video: { facingMode: "environment" } },
    { video: true },
  ];

  for (const constraints of cameraStrategies) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.log("Camera strategy failed, trying next...", error);
    }
  }

  throw new Error("لا يمكن الوصول إلى الكاميرا");
}

async function startCamera() {
  try {
    IDmainContainer.innerHTML = "";
    IDuploadContainer.innerHTML = `
      <video id="videoElement" autoplay playsinline></video>
      <img id="photo" alt="الصورة الملتقطة ستظهر هنا" style="display:none;">
    `;

    const videoElement = document.getElementById("videoElement");
    currentStream = await initializeCamera();
    videoElement.srcObject = currentStream;
  } catch (error) {
    console.error("Camera error:", error);
    clearUploadContainer();
  }
}

function capturePhoto() {
  const videoElement = document.getElementById("videoElement");
  const photo = document.getElementById("photo");

  if (!videoElement || !currentStream) {
    console.error("Video element or stream not available");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext("2d").drawImage(videoElement, 0, 0);

  stopCameraStream();

  const photoDataURL = canvas.toDataURL("image/png");
  photo.src = photoDataURL;
  photo.style.display = "block";
  photo.id = "photo";
  
  videoElement.remove();

  IDuploadContainer.innerHTML = "";
  IDuploadContainer.appendChild(photo);
  IDuploadContainer.classList.add("previewing");
  
  addImageClickHandler(photo, photoDataURL);
  updateSystemsCheckBackground();
}

openCameraButton.addEventListener("click", async () => {
  saveIDBtn = "CameraID";
  const videoElement = document.getElementById("videoElement");

  if (!videoElement) {
    await startCamera();
  } else {
    capturePhoto();
  }
});

// ===== SAVE HANDLER =====

document.getElementById("Doc-photo-save").addEventListener("click", async function () {
  if (!saveIDBtn) {
    console.warn("No image source selected");
    return;
  }

  try {
    let imgElement;

    if (saveIDBtn === "UploadPic") {
      imgElement = document.getElementById("IDImage");
    } else if (saveIDBtn === "CameraID") {
      imgElement = document.getElementById("photo");
    }

    if (!imgElement) {
      console.error("Image element not found");
      return;
    }

    const base64 = await saveImageToBase64(imgElement);
    console.log("Image saved successfully");
    
    
    $("#Doc-photo-modal").modal("hide");
    updateSystemsCheckBackground();
  } catch (error) {
    console.error("Save error:", error);
  }
});