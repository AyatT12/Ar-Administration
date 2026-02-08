// ******************************************************************sidebar toggle script*************************************************************************************//
// Variables
 const body = document.querySelector("body"),
  sidebar = body.querySelector(".sidebar-left");

document.addEventListener("DOMContentLoaded", () => {
  const sidebarRight = document.getElementById("rightSidebar");
  const sidebarLeft = document.getElementById("leftSidebar");

  const mainPageIcon = document.querySelector(".main-page-icon");
  const newPageIcon = document.querySelector(".new-Page-icon");

  const DESKTOP_WIDTH = 1700;

  /* ================= helper function ================= */

  function closeAllCollapses(sidebar) {
    if (!sidebar) return;

    sidebar.querySelectorAll(".collapse.show").forEach((el) => {
      const instance = bootstrap.Collapse.getInstance(el);
      if (instance) instance.hide();
    });
  }

  function updateIcons() {
    if (!mainPageIcon && !newPageIcon) return;
    if (window.innerWidth <= DESKTOP_WIDTH) return;

    const Open =
      !sidebarRight.classList.contains("closed") ||
      !sidebarLeft.classList.contains("closed");


      if (Open) {
      mainPageIcon?.style.setProperty("left", "-60px");
      newPageIcon?.style.setProperty("left", "-60px");
      newPageIcon?.style.setProperty("bottom", "90px");
    } else {
      mainPageIcon?.style.removeProperty("left");
      mainPageIcon?.style.removeProperty("bottom");
      newPageIcon?.style.removeProperty("left");
      newPageIcon?.style.removeProperty("bottom");
    }
  }

  function openSidebar(side) {
    setTimeout(() => {
      if (side === "right") {
        sidebarRight.classList.remove("closed");
        sidebarLeft.classList.add("closed");
        closeAllCollapses(sidebarLeft);
      }

      if (side === "left") {
        sidebarLeft.classList.remove("closed");
        sidebarRight.classList.add("closed");
        closeAllCollapses(sidebarRight);
      }

      updateIcons();
    }, 0);
  }

  function toggleSidebar(side) {
    setTimeout(() => {
      if (side === "right") {
        const willBeClosed = !sidebarRight.classList.contains("closed");
        sidebarRight.classList.toggle("closed");

        if (willBeClosed) {
          closeAllCollapses(sidebarRight);
        }

        if (!sidebarRight.classList.contains("closed")) {
          sidebarLeft.classList.add("closed");
          closeAllCollapses(sidebarLeft);
        }
      }

      if (side === "left") {
        sidebarLeft.classList.toggle("closed");

        if (!sidebarLeft.classList.contains("closed")) {
          sidebarRight.classList.add("closed");
          closeAllCollapses(sidebarRight);
        }
      }

      updateIcons();
    }, 0);
  }

  /* ================= hover ================= */

  sidebarRight.addEventListener("mouseenter", () => {
    openSidebar("right");
  });
  /* ================= toggle btn  ================= */
  const ToggleRighSidetBtn = document.getElementById("toggle-RightSide-Btn");
  ToggleRighSidetBtn.addEventListener("click", function () {
    if (sidebarRight.classList.contains("closed")) {
      openSidebar("right");
    } else {
      toggleSidebar("right");
    }
  });
  /* ================================== */

  document.querySelectorAll('[data-bs-toggle="collapse"]').forEach((el) => {
    el.addEventListener("click", function (e) {
      if (sidebarRight.classList.contains("closed")) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    el.addEventListener(
      "touchstart",
      function (e) {
        if (sidebarRight.classList.contains("closed")) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const target = this.getAttribute("href") || this.dataset.bsTarget;
        if (target) {
          const targetEl = document.querySelector(target);
          if (targetEl) {
            new bootstrap.Collapse(targetEl).toggle();
          }
        }
      },
      { passive: false }
    );
  });

  /* ================= Prevent collapse from showing when sidebar is closed ================= */

  document.querySelectorAll(".collapse").forEach((collapseEl) => {
    collapseEl.addEventListener("show.bs.collapse", function (e) {
      if (sidebarRight.classList.contains("closed")) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  /* ================= export the function  ================= */
  window.toggleSidebar = toggleSidebar;
});
//***************************************************************************main sidebar collapse script****************************************************************************** */
const  sidebarRight = body.querySelector(".sidebar-right");

const collapsibleElements = sidebarRight.querySelectorAll(".collapse");

collapsibleElements.forEach((element) => {
  element.addEventListener("show.bs.collapse", function (event) {
    if (sidebarRight.classList.contains("close")) {
      event.preventDefault(); 
      return;
    }

    collapsibleElements.forEach((otherElement) => {
      if (otherElement !== element) {
        const collapseInstance = bootstrap.Collapse.getInstance(otherElement);
        if (collapseInstance) {
          collapseInstance.hide();
        }
      }
    });
  });
});

//**************************************************************************alert sidebar collapse script******************************************************************************* */

const collapse = document.querySelectorAll(".accordion-item");

collapse.forEach((item) => {
  item.querySelector(".accordion-item-header").addEventListener("click", () => {
    item.classList.toggle("open");
    collapse.forEach((otherElement) => {
      if (otherElement !== item) {
        otherElement.classList.remove("open");
      }
    });
  });
});

//*****************************************************************initialize tooltips*************************************************************************************** */

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// //***************************************************************** inputs collapses toggle *************************************************************************************** */
const inputsAccordion = document.querySelectorAll(".inputs-accordion-item");

inputsAccordion.forEach((item) => {
  item
    .querySelector(".inputs-accordion-item-header")
    .addEventListener("click", () => {
      item.classList.toggle("open");
      inputsAccordion.forEach((otherElement) => {
        if (otherElement !== item) {
          otherElement.classList.remove("open");
        }
      });
    });
});
// //***************************************************************** move foucs between fields*************************************************************************************** */
document.addEventListener("DOMContentLoaded", function () {
  const accordionItems = document.querySelectorAll(".inputs-accordion-item");

  if (accordionItems.length > 0) {
    // Case for forms with accordion items
    console.log("ki");
    accordionItems.forEach((item) => {
      const header = item.querySelector(".inputs-accordion-item-header");
      const focusableElements = item.querySelectorAll(
        "input, select, textarea, button"
      );

      // Set focus on the first input when the accordion item is clicked
      header.addEventListener("click", function () {
        setTimeout(() => {
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }, 300);
      });

      // Move focus to the next element on pressing Enter
      focusableElements.forEach((element, index) => {
        element.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            const nextElement = focusableElements[index + 1];
            if (nextElement) {
              nextElement.focus();
            }
          }
        });
      });
    });
  }

  // Case for regular forms (not inside accordion)
  const regularFormElements = document.querySelectorAll(
    "input, select, textarea"
  );
  if (regularFormElements.length > 0) {
    regularFormElements[1].focus();
  }
  regularFormElements.forEach((element, index) => {
    element.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextElement = regularFormElements[index + 1];
        if (nextElement) {
          nextElement.focus();
        }
      }
    });
  });
});

// //********************************************************************** validation form submit ********************************************************************************** */
(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  // Function to open an accordion item
  const openAccordionItem = (item, inputsAccordion) => {
    item.classList.add("open");
    inputsAccordion.forEach((otherElement) => {
      if (otherElement !== item) {
        otherElement.classList.remove("open");
      }
    });
  };

  // Function to validate accordion sections or regular form inputs
  const validateAccordionSections = (form) => {
    // THIS CASE IF THERE IS MANY accordionS BUT NOT IN THE SAME FORM
    const GeneralAccordionItems = document.querySelectorAll(
      ".inputs-accordion-item"
    );
    const accordionItems = form.querySelectorAll(".inputs-accordion-item");
    let formIsValid = true;
    let firstInvalidInput = null;

    if (accordionItems.length > 0) {
      // Validation for forms with accordion sections
      Array.from(accordionItems).forEach((item) => {
        const inputs = item.querySelectorAll("input, select, textarea"); // Scope to the current accordion item
        const checkIcon = item.querySelector(".data-check");
        let sectionIsValid = true;

        // Validate inputs within the accordion section
        Array.from(inputs).forEach((input) => {
          if (!input.checkValidity()) {
            sectionIsValid = false;
            if (!firstInvalidInput) {
              firstInvalidInput = input; // Store the first invalid input

              // Open the accordion section containing the first invalid input
              openAccordionItem(item, GeneralAccordionItems);
            }
          }
        });

        // Set checkIcon background color based on validity
        if (checkIcon) {
          checkIcon.style.backgroundColor = sectionIsValid ? "green" : "";
        }

        // Update overall form validity
        formIsValid = formIsValid && sectionIsValid;
      });
    } else {
      // Validation for regular forms (without accordion sections)
      const inputs = form.querySelectorAll("input, select, textarea");
      Array.from(inputs).forEach((input) => {
        if (!input.checkValidity()) {
          if (!firstInvalidInput) {
            firstInvalidInput = input; // Store the first invalid input
          }
          formIsValid = false;
        }
      });
    }

    // Focus the first invalid input, if any
    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }

    // Add 'was-validated' class to the form if invalid
    if (!formIsValid) {
      form.classList.add("was-validated");
    }

    return formIsValid;
  };

  // Function to validate and update check icons for each input field
  const validateInputFields = () => {
    const accordionItems = document.querySelectorAll(".inputs-accordion-item");

    accordionItems.forEach((item) => {
      const inputs = item.querySelectorAll("input, select, textarea");
      const checkIcon = item.querySelector(".data-check");

      const validateInputs = () => {
        let allValid = true;
        inputs.forEach((input) => {
          if (!input.checkValidity()) {
            allValid = false;
          }
        });

        if (checkIcon) {
          checkIcon.style.backgroundColor = allValid ? "green" : "";
        }
      };

      inputs.forEach((input) => {
        input.addEventListener("input", validateInputs);
        input.addEventListener("blur", validateInputs);
      });
    });
  };

  // Apply validation to all forms on submit
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        const isFormValid = validateAccordionSections(form);

        if (!isFormValid) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      false
    );
  });

  // Initialize input field validation on page load
  document.addEventListener("DOMContentLoaded", validateInputFields);
})();

// //********************************************************************** stop autocompelete ********************************************************************************** */

document.querySelectorAll("input, select, textarea").forEach((el) => {
  el.setAttribute("autocomplete", "off");
});


// //********************************************************************** number inputs script prevent entering negitive values ********************************************************************************** */
document.querySelectorAll('input[type="number"]').forEach(function (input) {
  input.addEventListener("keydown", function (event) {
    if (event.key === "-" || event.keyCode === 189) {
      event.preventDefault();
    }
  });
});
// //********************************************************************** email inputs script prevent entering arabic values ********************************************************************************** */
document.querySelectorAll('input[type="email"]').forEach(function (input) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/[\u0600-\u06FF]/g, "");
  });
});

// //********************************************************************** تحديد طول اسم الموظف ********************************************************************************** */

function getFirstTwoWords(name) {
  const words = name.split(" ");
  return words.slice(0, 2).join(" ");
}

const employeeNames = document.querySelectorAll(".employee-name");

employeeNames.forEach((element) => {
  const originalName = element.textContent.trim();
  const limitedName = getFirstTwoWords(originalName);
  element.textContent = limitedName;
});

