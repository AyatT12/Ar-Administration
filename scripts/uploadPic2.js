// // //////////////////////////////////////////////// رفع صورة الهوية ////////////////////////////////////////////////////////////////////////
let saveDocBtn = null;
let hasValidImage = false; 

document.getElementById("UploadPic").addEventListener("click", function () {
  saveDocBtn = "UploadPic";
  console.log(saveDocBtn);
});

const DocUploadContainer = document.querySelector(".Doc-upload-container");
const DocMainContainer = document.querySelector(".Doc-main-container");
const DocUploadPic = document.getElementById("UploadPic");
const DocimageUpload = document.getElementById("DocimageUpload");
var imgeURL;
const DocuploadedImg = null;
//

DocUploadPic.addEventListener("click", function () {
  DocimageUpload.click();
  removeDocImg.style.display = "Block";
});

DocimageUpload.addEventListener("change", function () {
  const file = DocimageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const DocimageURL = e.target.result;
      const DocpreviewImage = document.createElement("img");
      DocpreviewImage.classList.add("preview-image");
      DocpreviewImage.src = DocimageURL;
      DocpreviewImage.id = "DocImage";

      DocpreviewImage.style.cursor = "pointer";
      DocpreviewImage.title = "Inappropriate file type";
      DocpreviewImage.addEventListener("click", function () {
        openImageInNewTab(DocimageURL);
      });

      imgeURL = DocimageURL;
      DocMainContainer.innerHTML =
        '<i class="fa-regular fa-circle-xmark"  style="cursor: pointer;"></i>';
      DocUploadContainer.innerHTML = "";
      DocUploadContainer.appendChild(DocpreviewImage);
      DocUploadContainer.classList.add("previewing");

      hasValidImage = true; 
    };
    reader.readAsDataURL(file);
  }
});

removeDocImg.addEventListener("click", function (event) {
  event.preventDefault();
  if (DocUploadContainer.firstChild) {
    DocUploadContainer.innerHTML = "";
    DocMainContainer.innerHTML = "";
    DocUploadContainer.classList.remove("previewing");
    DocUploadContainer.innerHTML ='';

    hasValidImage = false; 
    resetButtonImage();
  }
});

// Global variable to track which button was clicked
let currentUploadButton = null;

// // ////////////////////////////////////////////////  التقاط صورة الهوية او الرخصة////////////////////////////////////////////////////////////////////////
const openCameraButton = document.getElementById("openCamera");
document.getElementById("openCamera").addEventListener("click", function () {
  saveDocBtn = "CameraDoc";
  console.log(saveDocBtn);
});

openCameraButton.addEventListener("click", async () => {
  let videoElement = document.getElementById("videoElement");
  let photo = document.getElementById("photo");

 DocMainContainer.innerHTML =
        '<i class="fa-regular fa-circle-xmark"  style="cursor: pointer;"></i>';
  removeDocImg.style.display = "Block";

  if (!videoElement) {
    DocUploadContainer.innerHTML = `
            <video id="videoElement" autoplay></video>
            <img id="photo" alt="The screen capture will appear in this box." style="display:none;">
        `;
    videoElement = document.getElementById("videoElement");
    photo = document.getElementById("photo");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" },
        },
      });
      videoElement.srcObject = stream;
    } catch (error) {
      console.log("Back camera not available, using default camera");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
        });
        videoElement.srcObject = stream;
      } catch (fallbackError) {
        console.error("Error accessing any camera:", fallbackError);
      }
    }
  } else {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    const context = canvasElement.getContext("2d");
    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    const dataUrl = canvasElement.toDataURL("image/png");
    photo.src = dataUrl;
    photo.style.display = "block";

    // عند الضغط يتم فتح الصورة في تاب مستقلة
    photo.style.cursor = "pointer";
    photo.title = "Inappropriate file type";
    photo.addEventListener("click", function () {
      openImageInNewTab(dataUrl);
    });

    hasValidImage = true;
    videoElement.remove();
  }
});

//الفانكشن المسؤلة عن فتح الصورة للهوية و رخصة القيادة و صور الفحص الظاهري
function openImageInNewTab(imageDataUrl) {
 var newTab = window.open();

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
            document.body.offsetHeight; // Force reflow
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

// Save the uploaded Docphoto image
function SaveUplodedDocphoto() {
  const img = document.getElementById("DocImage");
  if (!img) {
    console.log("No image found for uploaded Doc photo");
    $("#Doc-photo-modal").modal("hide");
    return false;
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Check if canvas width is 0
  if (canvas.width === 0) {
    $("#Doc-photo-modal").modal("hide");
    return false;
  }

  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  const base64 = canvas.toDataURL("image/jpeg");
  console.log(base64);
  $("#Doc-photo-modal").modal("hide");
  return true;
}

// Save the camera Docphoto image
function SaveCameraDocphoto() {
  const img = document.getElementById("photo");
  if (!img) {
    console.log("No image found for camera Doc photo");
    $("#Doc-photo-modal").modal("hide");
    return false;
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Check if canvas width is 0
  if (canvas.width === 0) {
    $("#Doc-photo-modal").modal("hide");
    return false;
  }

  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  const base64 = canvas.toDataURL("image/jpeg");
  console.log(base64);
  $("#Doc-photo-modal").modal("hide");
  return true;
}

// تحديث زر فتح مودال الهوية في حالة تم رفع صورة
function updateButtonImage() {
  if (currentUploadButton) {
    const img = currentUploadButton.querySelector("img");
    const activeIcon = currentUploadButton.getAttribute("data-active-icon");

    if (img && activeIcon) {
      img.src = activeIcon;
    }
  }
  currentUploadButton = null;
}

function resetButtonImage() {
  if (currentUploadButton) {
    const img = currentUploadButton.querySelector("img");
    const initialIcon = currentUploadButton.getAttribute("data-initial-icon");

    if (img && initialIcon) {
      img.src = initialIcon;
    } else if (img) {
      img.style.filter = "none";
      img.style.opacity = "1";
    }
  }
  currentUploadButton = null;
}

document.querySelectorAll(".Upload-Photo-Button").forEach((button) => {
  button.addEventListener("click", function () {
    currentUploadButton = this;

    this.style.opacity = "0.8";
    setTimeout(() => {
      this.style.opacity = "1";
    }, 200);
  });
});

document.getElementById("Doc-photo-save").addEventListener("click", function () {
  let saveSuccessful = false;

  if (saveDocBtn === "UploadPic") {
    saveSuccessful = SaveUplodedDocphoto();
  } else if (saveDocBtn === "CameraDoc") {
    saveSuccessful = SaveCameraDocphoto();
  }

  if (saveSuccessful && hasValidImage) {
    updateButtonImage();
  } else {
    resetButtonImage();
  }
});

document
  .getElementById("Doc-photo-modal")
  .addEventListener("hidden.bs.modal", function () {
    if (!hasValidImage) {
      resetButtonImage();
    }
    currentUploadButton = null;
  });

document
  .getElementById("Doc-photo-modal")
  .addEventListener("show.bs.modal", function () {
    const hasImage =
      DocUploadContainer.querySelector("img.preview-image") ||
      DocUploadContainer.querySelector("img#photo") ||
      DocUploadContainer.querySelector("img#DocImage");
    hasValidImage = !!hasImage;
  });

