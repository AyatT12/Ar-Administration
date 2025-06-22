jQuery(document).ready(function () {
   
  ExpensesImgUpload();
  compensationImgUpload();
});
//⁡⁢⁣⁣//////////////////////////    𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻𝘀   ////////////////////////////////////⁡

//=======================================’Moving Between Fieldsets=============================================================
let current_fs, next_fs, previous_fs;
const nextButtons = document.querySelectorAll(".next");
const ExpensesCheckbox = document.getElementById('expenses');
const selectCompensation = document.getElementById("Settlement-type");
const fieldsets = document.querySelectorAll("fieldset");
let = selectedValue = 1
selectCompensation.addEventListener('change', function() {
  selectedValue = this.value;
});
function setFocusToFirstInput(fieldset) {
    var firstFocusable = fieldset.find("input, select , textarea").first();
    if (firstFocusable.length) {
        firstFocusable.focus();
    }
}

function moveToNextInput(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        let formElements = Array.from(
            event.target.form.querySelectorAll("input, select, button , textarea")
        );
        let index = formElements.indexOf(event.target);

        if (index > -1 && index < formElements.length - 1) {
            let nextElement = formElements[index + 1];
            if (nextElement.tagName === "BUTTON" || nextElement.type === "button") {
                nextElement.click();
            } else {
                nextElement.focus();
            }
        }
    }
}

$(document).ready(function () {
    $("input, select, button , textarea").on("keydown", moveToNextInput);

    var firstFieldset = $("fieldset").first();
    setFocusToFirstInput(firstFieldset);
});

$(".next").click(function () {
  console.log(selectedValue)

  const nextBtn = this; 
  const current_fs = $(nextBtn).closest("fieldset");
  let next_fs = current_fs.next();
  
  if (current_fs.attr('id') === 'firstFieldset') {
    if (!ExpensesCheckbox.checked && (selectedValue === "0" )) {
        next_fs = current_fs.next().next();
        $("#progressbar li").eq($("fieldset").index(current_fs.next())).addClass("active");
        $("#progressbar li").eq($("fieldset").index(current_fs.next().next())).addClass("active");

    } else if (!ExpensesCheckbox.checked &&  !(selectedValue === "0" )) {
      next_fs = current_fs.next().next().next();
      console.log(next_fs)
      $("#progressbar li").eq($("fieldset").index(current_fs.next())).addClass("active");
      $("#progressbar li").eq($("fieldset").index(current_fs.next().next())).addClass("active");
      $("#progressbar li").eq($("fieldset").index(current_fs.next().next().next())).addClass("active");

    } else {
        next_fs = current_fs.next();
    }
  }
  if (current_fs.attr('id') === 'SecondFieldset') {
    if (ExpensesCheckbox.checked &&  !(selectedValue === "0" )) {
      next_fs = current_fs.next().next();
      $("#progressbar li").eq($("fieldset").index(current_fs.next())).addClass("active");
      $("#progressbar li").eq($("fieldset").index(current_fs.next().next())).addClass("active");

    }
  }

  next_fs.show();
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  current_fs.hide();

  setFocusToFirstInput(next_fs);
});

$(".previous").click(function () {
    const prevBtn = this; 
    current_fs = $(prevBtn).closest("fieldset");
    previous_fs = current_fs.prev();
    if (current_fs.attr('id') === 'FourthFieldset') {
      if (ExpensesCheckbox.checked && (selectedValue === "0" )) {
        previous_fs = current_fs.prev();
      } else if (!ExpensesCheckbox.checked && !(selectedValue === "0" )) {
        previous_fs = current_fs.prev().prev().prev();
        $("#progressbar li").eq($("fieldset").index(current_fs.prev())).removeClass("active");
        $("#progressbar li").eq($("fieldset").index(current_fs.prev().prev())).removeClass("active");

      } else if (ExpensesCheckbox.checked && !(selectedValue === "0" )) {
        previous_fs = current_fs.prev().prev();
        $("#progressbar li").eq($("fieldset").index(current_fs.prev())).removeClass("active");
        $("#progressbar li").eq($("fieldset").index(current_fs.prev().prev())).removeClass("active");

      }
    }

    if (current_fs.attr('id') === 'ThirdFieldset') {
      if (!ExpensesCheckbox.checked && (selectedValue === "0" )) {
        previous_fs = current_fs.prev().prev();
        $("#progressbar li").eq($("fieldset").index(current_fs.prev())).removeClass("active");
      }
    }
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    previous_fs.show();
    current_fs.hide();

    setFocusToFirstInput(previous_fs);
});

//====================================================================================================
//========================================Upload Expenses/compensation Imgs Lists============================================================
//====================================================================================================
var compensationArray = [];
var expensesArray = [];
var compensationTdIndex = 0; 
var expensesTdIndex = 0; 

function compensationImgUpload() {
  var maxLength = 4;
  var uploadBtnBox = document.getElementById('compensation-upload-box');

  $('#compensation-images').on('change', function (e) {
    handleImageUpload(e, '#compensation-Attatchments-Table', compensationArray, maxLength, uploadBtnBox, 'compensation');
  });
}

function ExpensesImgUpload() {
  var maxLength = 4;
  var uploadBtnBox = document.getElementById('Expenses-upload-box');

  $('#Expenses-images').on('change', function (e) {
    handleImageUpload(e, '#Expenses-Attatchments-Table', expensesArray, maxLength, uploadBtnBox, 'expenses');
  });
}

function handleImageUpload(event, tableSelector, array, maxLength, uploadBtnBox, type) {
  var uploadBox = $(event.target).closest('.upload__box');
  var files = event.target.files;
  var filesArr = Array.prototype.slice.call(files);

  for (var i = 0; i < Math.min(filesArr.length, maxLength - array.length); i++) {
    (function (f) {
      if (f.type === 'image/heic' || f.type === 'image/heif' || f.name.endsWith('.heic') || f.name.endsWith('.heif')) {
        heic2any({ blob: f, toType: "image/jpeg" })
          .then(function (convertedBlob) {
            processFile(convertedBlob, f.name, tableSelector, array, maxLength, uploadBtnBox, type);
          })
          .catch(function (err) {
            console.error("Error converting HEIC/HEIF image:", err);
          });
      } else {
        processFile(f, f.name, tableSelector, array, maxLength, uploadBtnBox, type);
      }
    })(filesArr[i]);
  }

  $('body').on('click', '.upload__img-close1', function (e) {
    e.stopPropagation();
    var file = $(this).parent().data('file');

    for (var i = 0; i < array.length; i++) {
      if (array[i].f.name === file) {
        array.splice(i, 1);
        break;
      }
    }

    $(this).closest('.upload__img-box').remove();

    if (array.length < maxLength) {
      uploadBtnBox.style.display = 'flex';
      updateCurrentTdIndex(tableSelector, type, uploadBtnBox);
    }

    if (array.length === 0) {
      if (type === 'compensation') compensationTdIndex = 0;
      else expensesTdIndex = 0;

      uploadBtnBox.style.display = 'flex';
      $(`${tableSelector} td`).eq(type === 'compensation' ? compensationTdIndex : expensesTdIndex).append(uploadBtnBox);
    }
  });
}

function processFile(file, fileName, tableSelector, array, maxLength, uploadBtnBox, type) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var html = `
      <div class='upload__img-box Attatchments-img-box'>
        <div style='background-image: url(${e.target.result})' data-file='${fileName}' class='img-bg'>
          <div class='upload__img-close1'><i class='fa-regular fa-trash-can'></i></div>
        </div>
      </div>
    `;

    var currentTdIndex = type === 'compensation' ? compensationTdIndex : expensesTdIndex;
    var targetTd = $(`${tableSelector} td`).eq(currentTdIndex);
    targetTd.append(html);

    array.push({ f: file, url: e.target.result });

    updateCurrentTdIndex(tableSelector, type, uploadBtnBox);

    if (array.length >= maxLength) {
      uploadBtnBox.style.display = 'none';
    }
  };
  reader.readAsDataURL(file);
}

function updateCurrentTdIndex(tableSelector, type, uploadBtnBox) {
  var currentTdIndex = type === 'compensation' ? compensationTdIndex : expensesTdIndex;

  $(`${tableSelector} td`).each(function (index) {
    if ($(this).find('.upload__img-box').length === 0) {
      if (type === 'compensation') compensationTdIndex = index;
      else expensesTdIndex = index;

      uploadBtnBox.style.display = 'flex';
      $(this).append(uploadBtnBox);
      return false; // Break the loop
    }
  });
}


//========================================calculate Expenses/compensation  ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const ExpensesTable = document.getElementById("Expenses-Data-Table");
  const TotalExpenses = document.getElementById("TotalExpenses");

  const CompensationTable = document.getElementById("compensation-Data-Table");
  const TotalCompensation = document.getElementById("TotalCompensation");

  const calculateTotal = (table, totalRow) => {
      let sum = 0;

      table.querySelectorAll("tbody tr:not(:last-child)").forEach(row => {
          const valueCell = row.cells[1]; 
          const inputCell = valueCell.querySelector("input");

          let rawValue = inputCell ? inputCell.value : valueCell.textContent;
          let value = parseFloat(rawValue.replace(/,/g, '') || 0);

          if (!isNaN(value) && value <= 1000000) {
            sum += value;
          }else if(value >= 1000000) {
            sum += 1000000;
          }
      });

      totalRow.textContent = sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const addInputListeners = (table, totalRow) => {
    const inputs = table.querySelectorAll("input.Table-inputs");

    inputs.forEach(input => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        calculateTotal(table, totalRow);
      });
    });
  };

  addInputListeners(ExpensesTable, TotalExpenses);
  calculateTotal(ExpensesTable, TotalExpenses); 
  addInputListeners(CompensationTable, TotalCompensation);
  calculateTotal(CompensationTable, TotalCompensation);
});

//====================================================================================================

$('body').on('click', '.img-bg', function (e) {
  var imageUrl = $(this).css('background-image');
  imageUrl = imageUrl.replace(/^url\(['"](.+)['"]\)/, '$1');
  var newTab = window.open();
  newTab.document.body.innerHTML = '<img src="' + imageUrl + '">';

  $(newTab.document.body).css({
    'background-color': 'black',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
  });
});
//====================================================================================================
//====================================================================================================
const image = document.getElementById('hover-image-Settlement');
const dropdown = document.getElementById('dropdown-content-Settlement');

image.addEventListener('click', function () {
	if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        dropdown2.style.display = 'none';
        dropdown5.style.display = 'none';


    }
});
//====================================================================================================
//====================================================================================================
const image2 = document.getElementById('contract-value-Settlement2');
const dropdown2 = document.getElementById('dropdown-content-Settlement2');

image2.addEventListener('click', function () {
	if (dropdown2.style.display === 'block') {
        dropdown2.style.display = 'none';
        dropdown5.style.display = 'none';

    } else {
        dropdown2.style.display = 'block';
        dropdown.style.display = 'none';
        dropdown5.style.display = 'none';


    }
});
//====================================================================================================
//====================================================================================================
const image3 = document.getElementById('contract-value-Settlement3');
const dropdown3 = document.getElementById('dropdown-content-Settlement3');

image3.addEventListener('click', function () {
	if (dropdown3.style.display === 'block') {
        dropdown3.style.display = 'none';

    } else {
        dropdown3.style.display = 'block';
        dropdown4.style.display = 'none';

    }
});
//====================================================================================================
//====================================================================================================
const image4 = document.getElementById('contract-value-Settlement4');
const dropdown4 = document.getElementById('dropdown-content-Settlement4');

image4.addEventListener('click', function () {
	if (dropdown4.style.display === 'block') {
        dropdown4.style.display = 'none';

    } else {
        dropdown4.style.display = 'block';
        dropdown3.style.display = 'none';

    }
});
//====================================================================================================
//====================================================================================================
const image5 = document.getElementById('Settlement-type-Data');
const dropdown5 = document.getElementById('dropdown-content-Settlement5');

image5.addEventListener('click', function () {
	if (dropdown5.style.display === 'block') {
        dropdown5.style.display = 'none';
        dropdown2.style.display = 'none';
        dropdown.style.display = 'none';

    } else {
        dropdown5.style.display = 'block';
        dropdown2.style.display = 'none';
        dropdown.style.display = 'none';

    }
});

// // //////////////////////////////////////////////// رفع صورة التوقيع ////////////////////////////////////////////////////////////////////////

//variables//
let saveSignatureBtn = null;

document
  .getElementById("UploadSigntaurePic")
  .addEventListener("click", function () {
    saveSignatureBtn = "UploadSigntaurePic";
  });

document
  .getElementById("WriteSignature")
  .addEventListener("click", function () {
    saveSignatureBtn = "WriteSignature";
  });
const uploadContainer = document.querySelector(".upload-container");
const mainContainer = document.querySelector(".main-container");
const UploadSigntaurePic = document.getElementById("UploadSigntaurePic");
const imageUpload = document.getElementById("imageUpload");
var imgeURL;
const uploadedImg = null;
//

UploadSigntaurePic.addEventListener("click", function () {
  imageUpload.click();
});

imageUpload.addEventListener("change", function () {
  const file = imageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageURL = e.target.result;
      const previewImage = document.createElement("img");
      previewImage.classList.add("preview-image");
      previewImage.src = imageURL;
      previewImage.id = "signatureImage";
      imgeURL = imageURL;
      mainContainer.innerHTML =
        '<i class="fa-regular fa-circle-xmark"  style="cursor: pointer;"></i>';
      uploadContainer.innerHTML = "";
      uploadContainer.appendChild(previewImage);
      uploadContainer.classList.add("previewing");
    };
    reader.readAsDataURL(file);
  }
});

removeSignatureImg.addEventListener("click", function (event) {
  event.preventDefault();
  if (uploadContainer.firstChild) {
    uploadContainer.innerHTML = "";
    mainContainer.innerHTML = "";
    uploadContainer.classList.remove("previewing");
    uploadContainer.innerHTML =
      ' <img class="upload-icon" src="img/Rectangle 144.png" alt="Upload Icon"><p>ارفق صورة التوقيع</p>';
  }
});
// // //////////////////////////////////////////////// كتابة التوقيع ////////////////////////////////////////////////////////////////////////
const WriteSignature = document.getElementById("WriteSignature");
WriteSignature.addEventListener("click", function () {
  document.body.classList.add('no-scroll');
  uploadContainer.innerHTML = "";
  mainContainer.innerHTML = "";
  uploadContainer.innerHTML =
    '<canvas id="canvas" width="200" height="200" class="mb-2"></canvas>';
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 4;

  var drawing = false;
  var prevX = 0;
  var prevY = 0;
  var currX = 0;
  var currY = 0;

  function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  }

  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);

  canvas.addEventListener("touchstart", handleTouchStart, false);
  canvas.addEventListener("touchmove", handleTouchMove, false);
  canvas.addEventListener("touchend", handleTouchEnd, false);

  function handleMouseDown(e) {
    drawing = true;
    prevX = e.clientX - canvas.getBoundingClientRect().left;
    prevY = e.clientY - canvas.getBoundingClientRect().top;
  }

  function handleMouseMove(e) {
    if (!drawing) return;
    currX = e.clientX - canvas.getBoundingClientRect().left;
    currY = e.clientY - canvas.getBoundingClientRect().top;

    drawLine(prevX, prevY, currX, currY);
    prevX = currX;
    prevY = currY;
  }

  function handleMouseUp() {
    drawing = false;
  }

  function handleTouchStart(e) {
    drawing = true;
    prevX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    prevY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  }

  function handleTouchMove(e) {
    if (!drawing) return;
    currX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    currY = e.touches[0].clientY - canvas.getBoundingClientRect().top;

    drawLine(prevX, prevY, currX, currY);
    prevX = currX;
    prevY = currY;
  }

  function handleTouchEnd() {
    drawing = false;
  }
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.getElementById("clear").addEventListener("click", function () {
    clearCanvas();
  });
 
});
 function SaveWrittenSignature() {
  document.body.classList.remove('no-scroll');
	var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL();
    var link = document.createElement("a");
    link.href = dataURL;
    console.log(link.href);
    $("#signature-modal").modal("hide");

  }
 // Save the uploded signature image
 function SaveUplodedSignature() {
    const img = document.getElementById("signatureImage");
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/png");
    console.log(base64);
    $("#signature-modal").modal("hide");

  }
  document.getElementById("save").addEventListener("click", function () {
    if (saveSignatureBtn === "UploadSigntaurePic") {
      SaveUplodedSignature();
    } else if (saveSignatureBtn === "WriteSignature") {
      SaveWrittenSignature();
    } else {
      console.log("No button has been clicked yet");
    }
  });


