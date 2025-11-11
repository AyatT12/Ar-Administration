const systemsCheckLicense = document.querySelector(".systems-check-license");
const LicenseUploadContainer = document.querySelector(
  ".License-upload-container"
);
const LicenseMainContainer = document.querySelector(".License-main-container");
const UploadLicensePic = document.getElementById("UploadLicensePic");
const LicenseImageUpload = document.getElementById("LicenseimageUpload");
const openLicenseCameraButton = document.getElementById("openCameraLicense");

let saveLicenseBtn = null;
let currentLicenseStream = null; // Track active camera stream

// ===== UTILITY FUNCTIONS =====

function updateLicenseSystemsCheckBackground() {
  if (LicenseUploadContainer && systemsCheckLicense) {
    systemsCheckLicense.style.backgroundColor =
      LicenseUploadContainer.querySelector("img") ? "green" : "";
  }
}

function openImageInNewTab(imageDataUrl) {
  const newTab = window.open();
  if (!newTab) {
    return;
  }

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
        imgElement.onload = () =>
          saveImageToBase64(imgElement).then(resolve).catch(reject);
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

function stopLicenseCameraStream() {
  if (currentLicenseStream) {
    currentLicenseStream.getTracks().forEach((track) => track.stop());
    currentLicenseStream = null;
  }
}

function clearLicenseUploadContainer() {
  stopLicenseCameraStream();
  saveLicenseBtn = null;
  LicenseUploadContainer.innerHTML = "";
  LicenseMainContainer.innerHTML = "";
  LicenseUploadContainer.classList.remove("previewing");
  updateLicenseSystemsCheckBackground();
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

function handleLicenseImagePreview(dataURL) {
  const licensePreviewImage = new Image();
  licensePreviewImage.crossOrigin = "Anonymous";

  licensePreviewImage.onload = function () {
    licensePreviewImage.classList.add("preview-image");
    licensePreviewImage.id = "LicenseImage";
    saveLicenseBtn = "UploadLicensePic";

    addImageClickHandler(licensePreviewImage, dataURL);

    LicenseMainContainer.innerHTML =
      '<i class="fa-regular fa-circle-xmark xmark-icon"></i>';
    LicenseUploadContainer.innerHTML = "";
    LicenseUploadContainer.appendChild(licensePreviewImage);
    LicenseUploadContainer.classList.add("previewing");
    updateLicenseSystemsCheckBackground();
  };

  licensePreviewImage.onerror = function () {
    console.error("Failed to load image");
  };

  licensePreviewImage.src = dataURL;
}

// ===== EVENT LISTENERS =====

document.addEventListener(
  "DOMContentLoaded",
  updateLicenseSystemsCheckBackground
);

UploadLicensePic.addEventListener("click", () => {
  LicenseImageUpload.click();
  saveLicenseBtn = "UploadLicensePic";
});

LicenseImageUpload.addEventListener("change", async function () {
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
    reader.onload = (e) => handleLicenseImagePreview(e.target.result);
    reader.onerror = () => {
      console.error("Failed to read file");
    };
    reader.readAsDataURL(fileToProcess);
  } catch (error) {}
});

document
  .getElementById("removeLicenseImg")
  .addEventListener("click", function (e) {
    e.preventDefault();
    clearLicenseUploadContainer();
  });

// ===== CAMERA HANDLERS =====

async function initializeLicenseCamera() {
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

async function startLicenseCamera() {
  try {
    LicenseUploadContainer.innerHTML = `
            <video id="videoLicenseElement" autoplay playsinline></video>
            <img id="licensePhoto" alt="الصورة الملتقطة ستظهر هنا" style="display:none;">
        `;

    const videoElement = document.getElementById("videoLicenseElement");
    currentLicenseStream = await initializeLicenseCamera();
    videoElement.srcObject = currentLicenseStream;

    await new Promise((resolve) => {
      videoElement.onloadedmetadata = () => resolve();
    });
  } catch (error) {
    console.error("Camera error:", error);
    clearLicenseUploadContainer();
  }
}

function captureLicensePhoto() {
  const videoElement = document.getElementById("videoLicenseElement");
  const photo = document.getElementById("licensePhoto");

  if (!videoElement || !currentLicenseStream) {
    console.error("Video element or stream not available");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext("2d").drawImage(videoElement, 0, 0);

  stopLicenseCameraStream();

  const photoDataURL = canvas.toDataURL("image/png");
  photo.src = photoDataURL;
  photo.style.display = "block";
  photo.id = "licensePhoto";

  videoElement.remove();

  LicenseUploadContainer.innerHTML = "";
  LicenseUploadContainer.appendChild(photo);
  LicenseUploadContainer.classList.add("previewing");

  addImageClickHandler(photo, photoDataURL);
  updateLicenseSystemsCheckBackground();
}

openLicenseCameraButton.addEventListener("click", async () => {
  saveLicenseBtn = "CameraLicense";
  const videoElement = document.getElementById("videoLicenseElement");

  if (!videoElement) {
    await startLicenseCamera();
  } else {
    captureLicensePhoto();
  }
});

// ===== SAVE HANDLER =====

document
  .getElementById("License-photo-save")
  .addEventListener("click", async function () {
    if (!saveLicenseBtn) {
      console.warn("No image source selected");
      return;
    }

    try {
      let imgElement;

      if (saveLicenseBtn === "UploadLicensePic") {
        imgElement = document.getElementById("LicenseImage");
      } else if (saveLicenseBtn === "CameraLicense") {
        imgElement = document.getElementById("licensePhoto");
      }

      if (!imgElement) {
        console.error("Image element not found");
        return;
      }

      const base64 = await saveImageToBase64(imgElement);
      console.log("Image saved successfully");

      $("#License-photo-modal").modal("hide");
      updateLicenseSystemsCheckBackground();
    } catch (error) {
      console.error("Save error:", error);
    }
  });
