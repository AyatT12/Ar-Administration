const systemsCheck = document.querySelector('.systems-check');
const IDuploadContainer = document.querySelector(".Doc-upload-container");
const IDmainContainer = document.querySelector(".Doc-main-container");
const UploadPic = document.getElementById("UploadPic");
const IDimageUpload = document.getElementById("DocimageUpload");
const openCameraButton = document.getElementById('openCamera');
let saveIDBtn = null;
var imgeURL;

function updateSystemsCheckBackground() {
    if (IDuploadContainer && systemsCheck) {
        systemsCheck.style.backgroundColor = IDuploadContainer.querySelector("img") ? "green" : "";
    }
}

document.addEventListener("DOMContentLoaded", updateSystemsCheckBackground);

UploadPic.addEventListener("click", () => IDimageUpload.click());
saveIDBtn = "UploadPic";

IDimageUpload.addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    // Check if the file is heic or heif
    const isHEIC = file.type === "image/heic" || file.type === "image/heif" || file.name.endsWith(".heic") || file.name.endsWith(".HEIC") || file.name.endsWith(".heif");

    if (isHEIC) {
        try {
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.9,
            });

            const reader = new FileReader();
            reader.onload = function (e) {
                handleImagePreview(e.target.result);
            };
            reader.readAsDataURL(convertedBlob);

        } catch (err) {
            console.error("HEIC conversion failed", err);
            alert("فشل تحويل صورة HEIC، يرجى اختيار صورة بصيغة أخرى.");
        }

    } else {
        const reader = new FileReader();
        reader.onload = function (e) {
            handleImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function handleImagePreview(dataURL) {
    const IDpreviewImage = new Image();
    IDpreviewImage.crossOrigin = "Anonymous";
    IDpreviewImage.onload = function () {
        IDpreviewImage.classList.add("preview-image");
        IDpreviewImage.id = "IDImage";
        saveIDBtn = "UploadPic";
        imgeURL = dataURL;

        IDmainContainer.innerHTML = '<i class="fa-regular fa-circle-xmark xmark-icon"></i>';
        IDuploadContainer.innerHTML = "";
        IDuploadContainer.appendChild(IDpreviewImage);
        IDuploadContainer.classList.add("previewing");
        updateSystemsCheckBackground();
    };
    IDpreviewImage.src = dataURL;
}

document.getElementById("removeIDImg").addEventListener("click", function(e) {
    e.preventDefault();
    saveIDBtn = null;
    IDuploadContainer.innerHTML = "";
    IDmainContainer.innerHTML = "";
    IDuploadContainer.classList.remove("previewing");
    updateSystemsCheckBackground();
});

openCameraButton.addEventListener('click', async () => {
    saveIDBtn = "CameraID";
    let videoElement = document.getElementById('videoElement');
    
    if (!videoElement) {
        IDuploadContainer.innerHTML = `
            <video id="videoElement" autoplay></video>
            <img id="photo" alt="Captured photo" style="display:none;">
        `;
        IDmainContainer.innerHTML = '<i class="fa-regular fa-circle-xmark xmark-icon"></i>';
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            document.getElementById('videoElement').srcObject = stream;
        } catch (error) {
            console.error('Camera error:', error);
        }
    } else {
        captureCameraImage();
    }
});

function captureCameraImage() {
    const videoElement = document.getElementById('videoElement');
    const photo = document.getElementById('photo');
    
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    
    videoElement.srcObject.getTracks().forEach(track => track.stop());
    
    photo.src = canvas.toDataURL('image/png');
    photo.style.display = 'block';
    videoElement.remove();
    
    IDuploadContainer.innerHTML = "";
    IDuploadContainer.appendChild(photo);
    updateSystemsCheckBackground();
}

// Save Image Functions
function saveImageToBase64(imgElement) {
    return new Promise((resolve) => {
        // التأكد من ان الصورة اكتملت من حيث التحميل
        if (!imgElement.complete || !imgElement.naturalWidth) {
            imgElement.onload = () => resolve(saveImageToBase64(imgElement));
            return;
        }

        const canvas = document.createElement("canvas");
        // اضافة العرض و الارتفاع الاصليين للصورة 
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        
        const ctx = canvas.getContext("2d");
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(imgElement, 0, 0);
        
        const base64 = canvas.toDataURL("image/jpeg", 0.9);
        console.log(base64);
        resolve(base64);
    });
}

// اجراءات الحفظ 
document.getElementById("Doc-photo-save").addEventListener("click", async function() {
    let base64;
    
    if (saveIDBtn === "UploadPic") {
        const img = document.getElementById("IDImage");
        console.log(img)
        base64 = await saveImageToBase64(img);
    } 
    else if (saveIDBtn === "CameraID") {
        const img = document.getElementById("photo");
        console.log(img)
        base64 = await saveImageToBase64(img);
    }
    
    
    $("#Doc-photo-modal").modal("hide");
    updateSystemsCheckBackground();
});