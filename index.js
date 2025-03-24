// Dynamic input sizes
function adjustWidth(input) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const font = getComputedStyle(input).font;
  context.font = font;
  const textWidth = context.measureText(
    input.value || input.placeholder || " "
  ).width;
  input.style.width = `${textWidth + 5}px`;
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
  document.querySelectorAll(".contact-print").forEach((link) => link.remove());
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
    if (textarea && !textarea.value.trim()) {
      li.style.display = "none";
    }

    const input = li.querySelector("input");
    if (input && !input.value.trim()) {
      li.style.display = "none";
    }
  });

  document.querySelectorAll(".category-container").forEach((container) => {
    const hasVisibleInput = container.querySelector(
      "input:not([style*='display: none']), textarea:not([style*='display: none'])"
    );

    if (!hasVisibleInput) {
      const h1 = container.querySelector("h1");
      const hr = container.querySelector("hr");

      if (h1) h1.style.display = "none";
      if (hr) hr.style.display = "none";

      container.querySelectorAll("p").forEach((p) => {
        if (p.textContent.trim() === ":" || p.textContent.trim() === "-") {
          p.style.display = "none";
        }
      });
    }
  });

  document.querySelectorAll(".flex-container").forEach((container) => {
    const languageInput = container.querySelector(
      '.second-title[placeholder="Language"]'
    );
    const cefrInput = container.querySelector(
      '.third-title[placeholder="CEFR Level"]'
    );
    const separator = container.querySelector("p");

    if (separator && separator.textContent.trim() === ":") {
      const languageEmpty = !languageInput || !languageInput.value.trim();
      const cefrEmpty = !cefrInput || !cefrInput.value.trim();

      if (languageEmpty || cefrEmpty) {
        separator.style.display = "none";
      }
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

// Dynamic skill logic
function handleSkillInput(event) {
  const input = event.target;
  const skillList = input.closest("ul");

  if (input.value.trim() !== "") {
    const lastInput = skillList.querySelector("li:last-child input");
    if (lastInput === input) {
      addSkillBlock(skillList);
    }
  } else {
    removeSkillBlock(skillList);
  }
}

function addSkillBlock(skillList) {
  const newLi = document.createElement("li");
  newLi.className = "skill-list";
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.className = "second-title";
  newInput.placeholder = "Skill";
  newInput.style.marginLeft = "-10px";

  newInput.addEventListener("input", function () {
    adjustWidth(this);
    handleSkillInput(event);
  });

  newLi.appendChild(newInput);
  skillList.appendChild(newLi);

  adjustWidth(newInput);
}

function removeSkillBlock(skillList) {
  const skillInputs = skillList.querySelectorAll(
    '.second-title[placeholder="Skill"]'
  );

  if (
    skillInputs.length > 1 &&
    skillInputs[skillInputs.length - 1].value.trim() === ""
  ) {
    skillInputs[skillInputs.length - 1].parentNode.remove();
  }
}

function getLanguageContainer() {
  return [...document.querySelectorAll(".category-container")].find(
    (container) =>
      container.querySelector("h1")?.textContent.trim() === "Languages"
  );
}

// Dynamic language logic
function handleLanguageInput(event) {
  const input = event.target;
  const languageContainer = getLanguageContainer();

  if (input.value.trim() !== "") {
    const flexContainer = languageContainer.querySelector(
      ".flex-container:last-of-type"
    );
    const languageInput = flexContainer.querySelector(
      '.second-title[placeholder="Language"]'
    );
    const cefrInput = flexContainer.querySelector(
      '.third-title[placeholder="CEFR Level"]'
    );

    if (languageInput.value.trim() !== "" && cefrInput.value.trim() !== "") {
      addLanguageBlock(languageContainer);
    }
  } else {
    removeLanguageBlock(languageContainer);
  }
}

function addLanguageBlock(languageContainer) {
  const newFlexContainer = document.createElement("div");
  newFlexContainer.className = "flex-container";
  newFlexContainer.innerHTML = `
    <input type="text" class="second-title" placeholder="Language" />
    <p class="second-title" id="language-divider" style="margin: auto 5px auto 3px">:</p>
    <input type="text" class="third-title" placeholder="CEFR Level" style="margin: 0" />
  `;

  newFlexContainer.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function (event) {
      adjustWidth(this);
      handleLanguageInput(event);
    });
  });

  languageContainer.appendChild(newFlexContainer);

  newFlexContainer.querySelectorAll("input").forEach(adjustWidth);
}

function removeLanguageBlock(languageContainer) {
  const languageInputs = languageContainer.querySelectorAll(
    '.second-title[placeholder="Language"]'
  );
  const cefrInputs = languageContainer.querySelectorAll(
    '.third-title[placeholder="CEFR Level"]'
  );

  if (
    languageInputs.length > 1 &&
    languageInputs[languageInputs.length - 1].value.trim() === "" &&
    cefrInputs[cefrInputs.length - 1].value.trim() === ""
  ) {
    languageInputs[languageInputs.length - 1]
      .closest(".flex-container")
      .remove();
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
  newInput.id = "certification-input";
  newInput.placeholder = "Title";

  newInput.addEventListener("input", function () {
    adjustWidth(this);
    handleCertificationInput(event);
  });

  certificationContainer.appendChild(newInput);

  adjustWidth(newInput);
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

// save and load to file logic
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

  // Add new input below in description, skill, language and certification
  document.querySelectorAll(".text").forEach((textarea) => {
    textarea.addEventListener("input", handleDescriptionInput);
  });

  document
    .querySelectorAll('.second-title[placeholder="Skill"]')
    .forEach((input) => {
      input.addEventListener("input", handleSkillInput);
    });

  document
    .querySelectorAll(
      ".second-title[placeholder='Language'], .third-title[placeholder='CEFR Level']"
    )
    .forEach((input) => {
      input.addEventListener("input", handleLanguageInput);
    });

  const certificationContainer = getCertificationContainer();
  certificationContainer
    .querySelectorAll('.second-title[placeholder="Title"]')
    .forEach((input) => {
      input.addEventListener("input", handleCertificationInput);
    });
});
