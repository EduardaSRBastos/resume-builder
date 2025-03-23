// Dynamic input sizes
function adjustWidth(input) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const font = getComputedStyle(input).font;
  context.font = font;
  const textWidth = context.measureText(
    input.value || input.placeholder || " "
  ).width;
  input.style.width = `${textWidth + 10}px`;
}

// Add links in print and hide empty fields
function prepareForPrint() {
  document.querySelectorAll(".contact").forEach((input) => {
    if (input.value) {
      const link = document.createElement("a");
      if (input.type === "email" && input.value) {
        link.href = `mailto:${input.value}`;
      } else {
        link.href = input.value;
      }
      link.textContent = input.value;
      link.classList.add("contact-print");
      input.style.display = "none";
      input.parentNode.insertBefore(link, input.nextSibling);
    }
  });
}

function cleanupAfterPrint() {
  document
    .querySelectorAll(".contact-print")
    .forEach((link) => link.remove());
  document
    .querySelectorAll(".contact")
    .forEach((input) => (input.style.display = "block"));
}

function hideEmptyFields() {
  document.querySelectorAll("input, textarea").forEach((element) => {
    if (!element.value.trim()) {
      element.style.display = "none";
    }
  });

  document.querySelectorAll("ul li").forEach((li) => {
    const textarea = li.querySelector("textarea");
    if (!textarea || !textarea.value.trim()) {
      li.style.display = "none";
    }
  });

  document.querySelectorAll(".category-container").forEach((container) => {
    const hasVisibleInput = container.querySelector(
      "input:not([style*='display: none']), textarea:not([style*='display: none'])"
    );
    if (!hasVisibleInput) {
      container.querySelector("h1").style.display = "none";
      container.querySelector("hr").style.display = "none";

      container.querySelectorAll("p").forEach((p) => {
        if (p.textContent.trim() === ":" || p.textContent.trim() === "-") {
          p.style.display = "none";
        }
      });
    }
  });
}

function restoreHiddenFields() {
  document
    .querySelectorAll("input, textarea, ul li, h1, hr, p")
    .forEach((element) => {
      if (element.id !== "load-file") {
        element.style.display = "";
      }
    });
}

// Dynamic description logic
function handleDescriptionInput(event) {
  const textarea = event.target;
  const jobDescriptionList = textarea.closest("ul");

  if (textarea.value.trim() !== "") {
    const lastTextarea = jobDescriptionList.querySelector(
      "li:last-child textarea"
    );
    if (lastTextarea === textarea) {
      addDescriptionBlock(jobDescriptionList);
    }
  } else {
    removeDescriptionBlock(jobDescriptionList);
  }
}

function addDescriptionBlock(jobDescriptionList) {
  const newLi = document.createElement("li");
  newLi.innerHTML = `<textarea class="text" placeholder="Description"></textarea>`;
  jobDescriptionList.appendChild(newLi);

  newLi
    .querySelector(".text")
    .addEventListener("input", handleDescriptionInput);
}

function removeDescriptionBlock(jobDescriptionList) {
  const descriptions = jobDescriptionList.querySelectorAll(".text");
  if (
    descriptions.length > 1 &&
    descriptions[descriptions.length - 1].value.trim() === ""
  ) {
    descriptions[descriptions.length - 1].parentNode.remove();
  }
}

// Dynamic certification logic

function getCertificationContainer() {
  return [...document.querySelectorAll(".category-container")].find(
    (container) =>
      container.querySelector("h1")?.textContent.trim() ===
      "Certifications, Licences & Publications"
  );
}

function handleCertificationInput(event) {
  const input = event.target;
  const certificationContainer = getCertificationContainer();

  if (input.value.trim() !== "") {
    const lastInput = certificationContainer.querySelector(
      '.second-title[placeholder="Title"]:last-of-type'
    );
    if (lastInput === input) {
      addCertificationBlock(certificationContainer);
    }
  } else {
    removeCertificationBlock(certificationContainer);
  }
}

function addCertificationBlock(certificationContainer) {
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.className = "second-title";
  newInput.placeholder = "Title";

  certificationContainer.appendChild(newInput);

  newInput.addEventListener("input", handleCertificationInput);
}

function removeCertificationBlock(certificationContainer) {
  const certifications = certificationContainer.querySelectorAll(
    '.second-title[placeholder="Title"]'
  );

  if (
    certifications.length > 1 &&
    certifications[certifications.length - 1].value.trim() === ""
  ) {
    certifications[certifications.length - 1].remove();
  }
}

function saveToFile() {
  const certificationContainer = getCertificationContainer();

  let cvData = {
    name: document.querySelector(".name").value,
    email: document.querySelector('.contact[type="email"]').value,
    linkedin: document.querySelector('.contact[placeholder="Linkedin"]').value,
    portfolio: document.querySelector('.contact[placeholder="Portfolio"]')
      .value,

    workExperience: {
      jobTitle: document.querySelector('.second-title[placeholder="Job Title"]')
        .value,
      companyName: document.querySelector(
        '.third-title[placeholder="Company Name"]'
      ).value,
      startDate: document.querySelector(".work-start-date").value,
      endDate: document.querySelector(".work-end-date").value,
      location: document.querySelector('.third-title[placeholder="Location"]')
        .value,
      description: [
        ...document.querySelectorAll('.text[placeholder="Description"]'),
      ].map((textarea) => textarea.value),
    },

    education: {
      degree: document.querySelector('.second-title[placeholder="Degree"]')
        .value,
      schoolName: document.querySelector(
        '.third-title[placeholder="School Name"]'
      ).value,
      startDate: document.querySelector(".education-start-date").value,
      endDate: document.querySelector(".education-end-date").value,
      location: document.querySelector('.third-title[placeholder="Location"]')
        .value,
    },

    techSkills: [
      ...document.querySelectorAll('.second-title[placeholder="Skill"]'),
    ].map((input) => input.value),

    languages: {
      name: document.querySelector('.second-title[placeholder="Language"]')
        .value,
      level: document.querySelector('.third-title[placeholder="CEFR Level"]')
        .value,
    },

    certifications: [
      ...certificationContainer.querySelectorAll(
        '.second-title[placeholder="Title"]'
      ),
    ].map((input) => input.value),
  };

  let jsonData = JSON.stringify(cvData, null, 2);
  let blob = new Blob([jsonData], { type: "application/json" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "cv_data.json";
  a.click();
}

function loadFromFile(event) {
  let file = event.target.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = function (event) {
    let jsonData = JSON.parse(event.target.result);
    const certificationContainer = getCertificationContainer();

    document.querySelector(".name").value = jsonData.name || "";
    document.querySelector('.contact[type="email"]').value =
      jsonData.email || "";
    document.querySelector('.contact[placeholder="Linkedin"]').value =
      jsonData.linkedin || "";
    document.querySelector('.contact[placeholder="Portfolio"]').value =
      jsonData.portfolio || "";

    if (jsonData.workExperience) {
      document.querySelector('.second-title[placeholder="Job Title"]').value =
        jsonData.workExperience.jobTitle || "";
      document.querySelector('.third-title[placeholder="Company Name"]').value =
        jsonData.workExperience.companyName || "";
      document.querySelector(".work-start-date").value =
        jsonData.workExperience.startDate || "";
      document.querySelector(".work-end-date").value =
        jsonData.workExperience.endDate || "";
      document.querySelector('.third-title[placeholder="Location"]').value =
        jsonData.workExperience.location || "";

      const descriptions = jsonData.workExperience.description || [];
      const descriptionList = document.querySelector("ul");

      descriptionList.innerHTML = "";

      descriptions.forEach((description) => {
        const newLi = document.createElement("li");
        newLi.innerHTML = `<textarea class="text" placeholder="Description">${description}</textarea>`;
        descriptionList.appendChild(newLi);
      });

      descriptionList.querySelectorAll(".text").forEach((textarea) => {
        textarea.addEventListener("input", handleDescriptionInput);
        textarea.style.height = textarea.scrollHeight - 10 + "px";
      });
    }

    if (jsonData.education) {
      document.querySelector('.second-title[placeholder="Degree"]').value =
        jsonData.education.degree || "";
      document.querySelector('.third-title[placeholder="School Name"]').value =
        jsonData.education.schoolName || "";
      document.querySelector(".education-start-date").value =
        jsonData.education.startDate || "";
      document.querySelector(".education-end-date").value =
        jsonData.education.endDate || "";
      document.querySelector('.third-title[placeholder="Location"]').value =
        jsonData.education.location || "";
    }

    let skillInputs = document.querySelectorAll(
      '.second-title[placeholder="Skill"]'
    );

    skillInputs.forEach((input, index) => {
      input.value = jsonData.techSkills[index] || "";
      adjustWidth(input);
    });

    document.querySelector('.second-title[placeholder="Language"]').value =
      jsonData.languages.name || "";
    document.querySelector('.third-title[placeholder="CEFR Level"]').value =
      jsonData.languages.level || "";

    const certifications = jsonData.certifications || [];
    certificationContainer.innerHTML = `
      <h1>Certifications, Licences & Publications</h1>
      <hr>
    `;

    certifications.forEach((certification) => {
      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.className = "second-title";
      newInput.placeholder = "Title";
      newInput.value = certification;
      certificationContainer.appendChild(newInput);
      newInput.addEventListener("input", handleCertificationInput);
      adjustWidth(newInput);
    });

    addCertificationBlock(certificationContainer);

    document.querySelectorAll("input").forEach((input) => {
      adjustWidth(input);
    });
  };

  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", function () {
  // Dynamic size of inputs
  document.querySelectorAll("input").forEach((input) => {
    adjustWidth(input);
    input.addEventListener("input", function () {
      adjustWidth(this);
    });
  });

  // Dynamic size of textareas
  document.querySelectorAll(".text").forEach((textarea) => {
    textarea.style.height = "16px";
    textarea.style.height = textarea.scrollHeight - 10 + "px";
    textarea.addEventListener("input", function () {
      this.style.height = "16px";
      this.style.height = this.scrollHeight - 10 + "px";
    });
  });

  window.addEventListener("beforeprint", hideEmptyFields);
  window.addEventListener("beforeprint", prepareForPrint);
  window.addEventListener("afterprint", restoreHiddenFields);
  window.addEventListener("afterprint", cleanupAfterPrint);

  document.querySelectorAll(".text").forEach((textarea) => {
    textarea.addEventListener("input", handleDescriptionInput);
  });

  const certificationContainer = getCertificationContainer();
  certificationContainer
    .querySelectorAll('.second-title[placeholder="Title"]')
    .forEach((input) => {
      input.addEventListener("input", handleCertificationInput);
    });
});
