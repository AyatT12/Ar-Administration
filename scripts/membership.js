    //   كود التعامل مع  العضويات وعرض التفاصيل
      document.addEventListener('DOMContentLoaded', function () {
            const checkboxes = document.querySelectorAll('.membership-checkbox');
            const chevrons = document.querySelectorAll('.membership-chevron');
            const cardsContainer = document.getElementById('cardsContainer');

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    const membershipCard = this.closest('.Membership-card');
                    const chevron = membershipCard.querySelector('.membership-chevron');
                    const dataMembershipCard = membershipCard.querySelector('.Data-Membership-card');

                    if (!this.checked) {
                        chevron.classList.add('disabled');
                        chevron.style.color = '#969494';
                        dataMembershipCard.style.display = 'none';
                        chevron.style.transform = '';
                    } else {
                        chevron.classList.remove('disabled');
                        chevron.style.color = '#000000';
                        chevron.style.transform = '';
                    }
                });
            });

            chevrons.forEach(chevron => {
                chevron.addEventListener('click', function () {
                    const membershipCard = this.closest('div[class^="Membership-card"]');
                    const dataMembershipCard = membershipCard.querySelector('.Data-Membership-card');
                    const checkbox = membershipCard.querySelector('.membership-checkbox');
                    const ImgMembershipCard = this.closest('.img-Membership-card');

                    if (checkbox.checked) {
                        if (dataMembershipCard.style.display === 'none' || dataMembershipCard.style.display === '') {
                            document.querySelectorAll('.Data-Membership-card').forEach(card => {
                                card.style.display = 'none';
                            });

                            document.querySelectorAll('.membership-chevron').forEach(otherChevron => {
                                otherChevron.style.transform = 'rotate(0deg)';
                            });

                            dataMembershipCard.style.display = 'flex';
                            ImgMembershipCard.style.width = "33.33333333%";
                            chevron.style.transform = "rotate(180deg)";


                            if (window.innerWidth < 768) {
                                chevron.style.transform = "rotate(-270deg)";
                            }
                        } else {
                            dataMembershipCard.style.display = 'none';
                            chevron.style.transform = '';

                        }
                    }
                });
            });
        });

// كود تعطيل الاختيارات  و / او 
        document.addEventListener('DOMContentLoaded', function () {
            const checkboxPairs = [
                {
                    first: document.getElementById('AndCase-Current-amounts-vip'),
                    second: document.getElementById('OrCase-Current-amounts-vip')
                },
                {
                    first: document.getElementById('AndCase-kilos-amounts-vip'),
                    second: document.getElementById('OrCase-kilos-amounts-vip')
                },
                {
                    first: document.getElementById('AndCase-Current-amounts-Bronze'),
                    second: document.getElementById('OrCase-Current-amounts-Bronze')
                },
                {
                    first: document.getElementById('AndCase-kilos-amounts-Bronze'),
                    second: document.getElementById('OrCase-kilos-amounts-Bronze')
                },
                {
                    first: document.getElementById('AndCase-Current-amounts-Silver'),
                    second: document.getElementById('OrCase-Current-amounts-Silver')
                },
                {
                    first: document.getElementById('AndCase-kilos-amounts-Silver'),
                    second: document.getElementById('OrCase-kilos-amounts-Silver')
                },
                {
                    first: document.getElementById('AndCase-Current-amounts-Gold'),
                    second: document.getElementById('OrCase-Current-amounts-Gold')
                },
                {
                    first: document.getElementById('AndCase-kilos-amounts-Gold'),
                    second: document.getElementById('OrCase-kilos-amounts-Gold')
                }
                ,
                {
                    first: document.getElementById('AndCase-Current-amounts-Diamond'),
                    second: document.getElementById('OrCase-Current-amounts-Diamond')
                },
                {
                    first: document.getElementById('AndCase-kilos-amounts-Diamond'),
                    second: document.getElementById('OrCase-kilos-amounts-Diamond')
                }
            ];

            checkboxPairs.forEach(pair => {
                pair.first.addEventListener('change', function () {
                    pair.second.disabled = this.checked;
                });

                pair.second.addEventListener('change', function () {
                    pair.first.disabled = this.checked;
                });
            });
        });
// كود رفع وعرض صورة العضويات 
document.addEventListener('DOMContentLoaded', function () {

  function openImageInNewTab(imageDataUrl) {
    const newTab = window.open();
    newTab.document.write(`
      <html>
        <head>
          <title>View Image</title>
          <style>
            body {
              margin:0;
              background:black;
              display:flex;
              align-items:center;
              justify-content:center;
            }
            img {
              max-width:70vw;
              max-height:70vh;
              object-fit:contain;
            }
          </style>
        </head>
        <body>
          <img src="${imageDataUrl}">
        </body>
      </html>
    `);
  }

  document.querySelectorAll('.Membership-img').forEach(imgDiv => {
    imgDiv.style.cursor = 'pointer';
    imgDiv.title = 'اضغط لفتح الصورة';

    imgDiv.addEventListener('click', function (e) {
      if (e.target.closest('.form-check')) return;

      const bgImage = window.getComputedStyle(this).backgroundImage;
      if (!bgImage || bgImage === 'none') return;

      const imageUrl = bgImage.slice(5, -2);
      openImageInNewTab(imageUrl);
    });
  });

  const replaceCoverBtns = document.querySelectorAll('.ReplaceCoverBtn');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  let currentCard = null;

  replaceCoverBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentCard = this.closest('.Membership-card');
      fileInput.click();
    });
  });

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file || !currentCard) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const membershipImgDiv = currentCard.querySelector('.Membership-img');
      if (!membershipImgDiv) return;

      membershipImgDiv.style.backgroundImage = `url(${event.target.result})`;
      membershipImgDiv.style.backgroundSize = 'cover';
      membershipImgDiv.style.backgroundPosition = 'center';
      membershipImgDiv.style.backgroundRepeat = 'no-repeat';
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });

});

