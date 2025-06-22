const systemsCheckLicense = document.querySelector('.systems-check-license');
const LicenseUploadContainer = document.querySelector(".License-upload-container");
const LicenseMainContainer = document.querySelector(".License-main-container");
const UploadLicensePic = document.getElementById("UploadLicensePic");
const LicenseImageUpload = document.getElementById("LicenseimageUpload");
const openLicenseCameraButton = document.getElementById('openCameraLicense');
let saveLicenseBtn = null;
let licenseImgURL = "";

function updateLicenseSystemsCheckBackground() {
    if (LicenseUploadContainer && systemsCheckLicense) {
        systemsCheckLicense.style.backgroundColor = LicenseUploadContainer.querySelector("img") ? "green" : "";
    }
}

document.addEventListener("DOMContentLoaded", updateLicenseSystemsCheckBackground);

UploadLicensePic.addEventListener("click", function () {
    LicenseImageUpload.click();
    saveLicenseBtn = "UploadLicensePic";
});

LicenseImageUpload.addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    const isHEIC = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");

    const handleLicenseImagePreview = (dataURL) => {
        const licensePreviewImage = new Image();
        licensePreviewImage.classList.add("preview-image");
        licensePreviewImage.id = "LicenseImage";
        licensePreviewImage.crossOrigin = "anonymous";
        licensePreviewImage.onload = function () {
            LicenseMainContainer.innerHTML = '<i class="fa-regular fa-circle-xmark xmark-icon"></i>';
            LicenseUploadContainer.innerHTML = "";
            LicenseUploadContainer.appendChild(licensePreviewImage);
            LicenseUploadContainer.classList.add("previewing");
            updateLicenseSystemsCheckBackground();
        };
        licensePreviewImage.src = dataURL;
    };

    if (isHEIC) {
        try {
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.9,
            });

            const reader = new FileReader();
            reader.onload = function (e) {
                handleLicenseImagePreview(e.target.result);
            };
            reader.readAsDataURL(convertedBlob);

        } catch (err) {
            console.error("HEIC conversion failed", err);
            alert("فشل تحويل صورة HEIC، يرجى اختيار صورة بصيغة أخرى.");
        }
    } else {
        const reader = new FileReader();
        reader.onload = function (e) {
            handleLicenseImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("removeLicenseImg").addEventListener("click", function (event) {
    event.preventDefault();
    saveLicenseBtn = null;
    LicenseUploadContainer.innerHTML = "";
    LicenseMainContainer.innerHTML = "";
    LicenseUploadContainer.classList.remove("previewing");
    updateLicenseSystemsCheckBackground();
});

openLicenseCameraButton.addEventListener('click', async () => {
    saveLicenseBtn = "CameraLicense";
    let videoElement = document.getElementById('videoLicenseElement');
    let photo = document.getElementById('licensePhoto');

    if (!videoElement) {
        LicenseUploadContainer.innerHTML = `
            <video id="videoLicenseElement" autoplay></video>
            <img id="licensePhoto" alt="The screen capture will appear in this box." style="display:none;">
        `;
        LicenseMainContainer.innerHTML = '<i class="fa-regular fa-circle-xmark xmark-icon"></i>';

        videoElement = document.getElementById('videoLicenseElement');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;

            await new Promise(resolve => {
                videoElement.onloadedmetadata = () => resolve();
            });

        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    } else {
        captureLicenseCameraImage();
    }
});

function captureLicenseCameraImage() {
    const videoElement = document.getElementById('videoLicenseElement');
    const photo = document.getElementById('licensePhoto');

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);

    videoElement.srcObject.getTracks().forEach(track => track.stop());

    photo.src = canvas.toDataURL('image/png');
    photo.style.display = 'block';
    videoElement.remove();

    LicenseUploadContainer.innerHTML = "";
    LicenseUploadContainer.appendChild(photo);
    updateLicenseSystemsCheckBackground();
}

function saveImageToBase64(imgElement) {
    return new Promise((resolve) => {
        if (!imgElement.complete || !imgElement.naturalWidth) {
            imgElement.onload = () => resolve(saveImageToBase64(imgElement));
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
        console.log(base64);
        resolve(base64);
    });
}

document.getElementById("License-photo-save").addEventListener("click", async function () {
    let base64;

    if (saveLicenseBtn === "UploadLicensePic") {
        const img = document.getElementById("LicenseImage");
        if (img) base64 = await saveImageToBase64(img);
    } else if (saveLicenseBtn === "CameraLicense") {
        const img = document.getElementById("licensePhoto");
        if (img) base64 = await saveImageToBase64(img);
    }

    $("#License-photo-modal").modal("hide");
    updateLicenseSystemsCheckBackground();
});
