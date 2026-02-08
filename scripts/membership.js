//   كود التعامل مع  العضويات وعرض التفاصيل
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".membership-checkbox");
  const chevrons = document.querySelectorAll(".membership-chevron");
  const cardsContainer = document.getElementById("cardsContainer");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const membershipCard = this.closest(".Membership-card");
      const chevron = membershipCard.querySelector(".membership-chevron");
      const dataMembershipCard = membershipCard.querySelector(
        ".Data-Membership-card",
      );

      if (!this.checked) {
        chevron.classList.add("disabled");
        chevron.style.color = "#969494";
        dataMembershipCard.style.display = "none";
        chevron.style.transform = "";
      } else {
        chevron.classList.remove("disabled");
        chevron.style.color = "#000000";
        chevron.style.transform = "";
      }
    });
  });

  chevrons.forEach((chevron) => {
    chevron.addEventListener("click", function () {
      const membershipCard = this.closest('div[class^="Membership-card"]');
      const dataMembershipCard = membershipCard.querySelector(
        ".Data-Membership-card",
      );
      const checkbox = membershipCard.querySelector(".membership-checkbox");
      const ImgMembershipCard = this.closest(".img-Membership-card");

      if (checkbox.checked) {
        if (
          dataMembershipCard.style.display === "none" ||
          dataMembershipCard.style.display === ""
        ) {
          document.querySelectorAll(".Data-Membership-card").forEach((card) => {
            card.style.display = "none";
          });

          document
            .querySelectorAll(".membership-chevron")
            .forEach((otherChevron) => {
              otherChevron.style.transform = "rotate(0deg)";
            });

          dataMembershipCard.style.display = "flex";
          ImgMembershipCard.style.width = "33.33333333%";
          chevron.style.transform = "rotate(180deg)";

          if (window.innerWidth < 768) {
            chevron.style.transform = "rotate(-270deg)";
          }
        } else {
          dataMembershipCard.style.display = "none";
          chevron.style.transform = "";
        }
      }
    });
  });
});

// كود تعطيل الاختيارات  و / او
document.addEventListener("DOMContentLoaded", function () {
  const checkboxPairs = [
    {
      first: document.getElementById("AndCase-Current-amounts-vip"),
      second: document.getElementById("OrCase-Current-amounts-vip"),
    },
    {
      first: document.getElementById("AndCase-kilos-amounts-vip"),
      second: document.getElementById("OrCase-kilos-amounts-vip"),
    },
    {
      first: document.getElementById("AndCase-Current-amounts-Bronze"),
      second: document.getElementById("OrCase-Current-amounts-Bronze"),
    },
    {
      first: document.getElementById("AndCase-kilos-amounts-Bronze"),
      second: document.getElementById("OrCase-kilos-amounts-Bronze"),
    },
    {
      first: document.getElementById("AndCase-Current-amounts-Silver"),
      second: document.getElementById("OrCase-Current-amounts-Silver"),
    },
    {
      first: document.getElementById("AndCase-kilos-amounts-Silver"),
      second: document.getElementById("OrCase-kilos-amounts-Silver"),
    },
    {
      first: document.getElementById("AndCase-Current-amounts-Gold"),
      second: document.getElementById("OrCase-Current-amounts-Gold"),
    },
    {
      first: document.getElementById("AndCase-kilos-amounts-Gold"),
      second: document.getElementById("OrCase-kilos-amounts-Gold"),
    },
    {
      first: document.getElementById("AndCase-Current-amounts-Diamond"),
      second: document.getElementById("OrCase-Current-amounts-Diamond"),
    },
    {
      first: document.getElementById("AndCase-kilos-amounts-Diamond"),
      second: document.getElementById("OrCase-kilos-amounts-Diamond"),
    },
  ];

  checkboxPairs.forEach((pair) => {
    pair.first.addEventListener("change", function () {
      pair.second.disabled = this.checked;
    });

    pair.second.addEventListener("change", function () {
      pair.first.disabled = this.checked;
    });
  });
});
// كود رفع وعرض صورة العضويات
document.addEventListener("DOMContentLoaded", function () {
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

  document.querySelectorAll(".Membership-img").forEach((imgDiv) => {
    imgDiv.style.cursor = "pointer";
    imgDiv.title = "اضغط لفتح الصورة";

    imgDiv.addEventListener("click", function (e) {
      if (e.target.closest(".form-check")) return;

      const bgImage = window.getComputedStyle(this).backgroundImage;
      if (!bgImage || bgImage === "none") return;

      const imageUrl = bgImage.slice(5, -2);
      openImageInNewTab(imageUrl);
    });
  });

  const replaceCoverBtns = document.querySelectorAll(".ReplaceCoverBtn");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  let currentCard = null;

  replaceCoverBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentCard = this.closest(".Membership-card");
      fileInput.click();
    });
  });

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file || !currentCard) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const membershipImgDiv = currentCard.querySelector(".Membership-img");
      if (!membershipImgDiv) return;

      membershipImgDiv.style.backgroundImage = `url(${event.target.result})`;
      membershipImgDiv.style.backgroundSize = "cover";
      membershipImgDiv.style.backgroundPosition = "center";
      membershipImgDiv.style.backgroundRepeat = "no-repeat";
    };
    reader.readAsDataURL(file);
    fileInput.value = "";
  });
});
