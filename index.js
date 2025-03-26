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
    const inputOrTextarea = li.querySelector("input, textarea");
    if (inputOrTextarea && !inputOrTextarea.value.trim()) {
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

  document.querySelectorAll(".date-container").forEach((container) => {
    const startDateInput = container.querySelector(".second-title:first-child");
    const endDateInput = container.querySelector(".second-title:last-child");
    const separator = container.querySelector("p");

    if (!startDateInput.value.trim() || !endDateInput.value.trim()) {
      separator.style.display = "none";
    } else {
      separator.style.display = "block";
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

// Save to file logic
function saveToFile() {
  const certificationContainer = getCertificationContainer();

  const languages = [];

  const languageInputs = document.querySelectorAll(
    '.second-title[placeholder="Language"]'
  );
  const cefrInputs = document.querySelectorAll(
    '.third-title[placeholder="CEFR Level"]'
  );

  languageInputs.forEach((languageInput, index) => {
    const cefrInput = cefrInputs[index];
    languages.push({
      name: languageInput.value,
      level: cefrInput.value,
    });
  });

  let cvData = {
    name: document.querySelector(".name").value,
    email: document.querySelector('.contact[type="email"]').value,
    linkedin: document.querySelector('.contact[placeholder="Linkedin"]').value,
    portfolio: document.querySelector('.contact[placeholder="Portfolio"]')
      .value,

    workExperience: Array.from(
      document.querySelectorAll(
        ".category-container.work-experience .grid-container"
      )
    ).map((experience) => ({
      jobTitle: experience.querySelector(
        '.second-title[placeholder="Job Title"]'
      ).value,
      companyName: experience.querySelector(
        '.third-title[placeholder="Company Name"]'
      ).value,
      startDate: experience.querySelector(".work-start-date").value,
      endDate: experience.querySelector(".work-end-date").value,
      location: experience.querySelector('.third-title[placeholder="Location"]')
        .value,
      description: [
        ...experience.nextElementSibling.querySelectorAll(
          '.text[placeholder="Description"]'
        ),
      ].map((textarea) => textarea.value),
    })),

    education: Array.from(
      document.querySelectorAll(".category-container.education .grid-container")
    ).map((educationItem) => ({
      degree: educationItem.querySelector('.second-title[placeholder="Degree"]')
        .value,
      schoolName: educationItem.querySelector(
        '.third-title[placeholder="School Name"]'
      ).value,
      startDate: educationItem.querySelector(".education-start-date").value,
      endDate: educationItem.querySelector(".education-end-date").value,
      location: educationItem.querySelector(
        '.third-title[placeholder="Location"]'
      ).value,
    })),

    techSkills: [
      ...document.querySelectorAll('.second-title[placeholder="Skill"]'),
    ].map((input) => input.value),

    languages: languages,

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
  let fileName = cvData.name ? `${cvData.name} Resume.json` : "My Resume.json";
  a.download = fileName;
  a.click();
}

// Load to file logic
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
      const professionalExperienceSection = document.querySelector(
        ".category-container.work-experience"
      );
      const experienceBlocks =
        professionalExperienceSection.querySelectorAll(".grid-container");

      jsonData.workExperience.forEach((experience, index) => {
        let experienceBlock = experienceBlocks[index];

        if (!experienceBlock) {
          document.querySelector(".professional-experience-add").click();
          experienceBlock =
            professionalExperienceSection.querySelectorAll(".grid-container")[
              index
            ];
        }

        experienceBlock.querySelector(
          '.second-title[placeholder="Job Title"]'
        ).value = experience.jobTitle || "";

        experienceBlock.querySelector(
          '.third-title[placeholder="Company Name"]'
        ).value = experience.companyName || "";

        experienceBlock.querySelector(".work-start-date").value =
          experience.startDate || "";

        experienceBlock.querySelector(".work-end-date").value =
          experience.endDate || "";

        experienceBlock.querySelector(
          '.third-title[placeholder="Location"]'
        ).value = experience.location || "";

        let descriptionList = experienceBlock.nextElementSibling;
        descriptionList.innerHTML = "";

        experience.description.forEach((desc) => {
          let newLi = document.createElement("li");
          newLi.innerHTML = `<textarea class="text" placeholder="Description">${desc}</textarea>`;
          descriptionList.appendChild(newLi);
        });

        descriptionList.querySelectorAll(".text").forEach((textarea) => {
          textarea.addEventListener("input", handleDescriptionInput);
          textarea.style.height = textarea.scrollHeight - 10 + "px";
        });

        document.querySelectorAll("input").forEach((input) => {
          adjustWidth(input);
        });
      });
    }

    if (jsonData.education) {
      const educationContainer = document.querySelector(
        ".category-container.education"
      );
      const educationBlocks =
        educationContainer.querySelectorAll(".grid-container");

      jsonData.education.forEach((edu, index) => {
        let educationBlock = educationBlocks[index];

        if (!educationBlock) {
          document.querySelector(".education-add").click();
          educationBlock =
            educationContainer.querySelectorAll(".grid-container")[index];
        }

        educationBlock.querySelector(
          '.second-title[placeholder="Degree"]'
        ).value = edu.degree || "";

        educationBlock.querySelector(
          '.third-title[placeholder="School Name"]'
        ).value = edu.schoolName || "";

        educationBlock.querySelector(".education-start-date").value =
          edu.startDate || "";

        educationBlock.querySelector(".education-end-date").value =
          edu.endDate || "";

        educationBlock.querySelector(
          '.third-title[placeholder="Location"]'
        ).value = edu.location || "";
      });
    }

    let skillInputs = document.querySelectorAll(
      '.second-title[placeholder="Skill"]'
    );

    jsonData.techSkills.forEach((skill, index) => {
      if (index >= skillInputs.length) {
        addSkillBlock(skillInputs[0].closest("ul"));
        skillInputs = document.querySelectorAll(
          '.second-title[placeholder="Skill"]'
        );
      }
      skillInputs[index].value = skill;
      adjustWidth(skillInputs[index]);
    });

    if (jsonData.languages) {
      let languageInputs = document.querySelectorAll(
        '.second-title[placeholder="Language"]'
      );
      let cefrInputs = document.querySelectorAll(
        '.third-title[placeholder="CEFR Level"]'
      );

      jsonData.languages.forEach((lang, index) => {
        if (index >= languageInputs.length) {
          addLanguageBlock(getLanguageContainer());
          languageInputs = document.querySelectorAll(
            '.second-title[placeholder="Language"]'
          );
          cefrInputs = document.querySelectorAll(
            '.third-title[placeholder="CEFR Level"]'
          );
        }
        languageInputs[index].value = lang.name || "";
        cefrInputs[index].value = lang.level || "";
        adjustWidth(languageInputs[index]);
        adjustWidth(cefrInputs[index]);
      });
    }

    certificationContainer.innerHTML = `
    <h1>Certifications, Licences & Publications</h1>
    <hr>
  `;

    const certifications = jsonData.certifications || [];

    certifications.forEach((certification) => {
      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.id = "certification-input";
      newInput.className = "second-title";
      newInput.placeholder = "Title";
      newInput.value = certification;
      certificationContainer.appendChild(newInput);
      newInput.addEventListener("input", handleCertificationInput);
      adjustWidth(newInput);
    });

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

  // Add new professional experience logic
  const addProfessionalExperienceButton = document.querySelector(
    ".professional-experience-add"
  );

  addProfessionalExperienceButton.addEventListener("click", () => {
    const categoryContainer = document.querySelector(
      ".category-container.work-experience"
    );
    const professionalExperienceSection = categoryContainer;

    if (professionalExperienceSection) {
      let existingExperiences =
        professionalExperienceSection.querySelectorAll(".grid-container");

      let newGridContainer, newDescriptionList, removeButton;

      if (existingExperiences.length > 0) {
        const lastExperience =
          existingExperiences[existingExperiences.length - 1];

        newGridContainer = lastExperience.cloneNode(true);
        newDescriptionList = document.createElement("ul");
        newDescriptionList.innerHTML = `<li><textarea class="text" placeholder="Description"></textarea></li>`;

        let jobTitleContainer = newGridContainer.querySelector(
          ".job-title-container"
        );
        if (!jobTitleContainer) {
          jobTitleContainer = document.createElement("div");
          jobTitleContainer.classList.add("job-title-container");

          const jobTitleInput = newGridContainer.querySelector(".second-title");
          jobTitleContainer.appendChild(jobTitleInput);

          removeButton = document.createElement("button");
          removeButton.classList.add("remove");
          removeButton.textContent = "-";
          jobTitleContainer.appendChild(removeButton);

          newGridContainer.prepend(jobTitleContainer);
        } else {
          removeButton = jobTitleContainer.querySelector(".remove");
        }
      } else {
        newGridContainer = document.createElement("div");
        newGridContainer.classList.add("grid-container");

        newGridContainer.innerHTML = `
            <div class="job-title-container">
                <input type="text" class="second-title" placeholder="Job Title" />
                <button class="remove">-</button>
            </div>

            <div class="date-container">
                <input type="text" class="work-start-date second-title" placeholder="Start Date" />
                <p class="second-title">-</p>
                <input type="text" class="work-end-date second-title" placeholder="End Date/Present" />
            </div>

            <input type="text" class="third-title" placeholder="Company Name" />
            <input type="text" class="third-title location" placeholder="Location" />
        `;

        newDescriptionList = document.createElement("ul");
        newDescriptionList.innerHTML = `<li><textarea class="text" placeholder="Description"></textarea></li>`;

        removeButton = newGridContainer.querySelector(".remove");
      }

      removeButton.addEventListener("click", () => {
        newGridContainer.remove();
        newDescriptionList.remove();
      });

      newGridContainer.querySelectorAll("input, textarea").forEach((input) => {
        input.value = "";
      });

      professionalExperienceSection.appendChild(newGridContainer);
      professionalExperienceSection.appendChild(newDescriptionList);

      newDescriptionList.querySelectorAll(".text").forEach((textarea) => {
        textarea.addEventListener("input", handleDescriptionInput);
      });

      newGridContainer.querySelectorAll("input").forEach((input) => {
        adjustWidth(input);
        input.addEventListener("input", function () {
          adjustWidth(this);
        });
      });
    }
  });

  // Add new education logic
  const addEducationButton = document.querySelector(".education-add");

  addEducationButton.addEventListener("click", () => {
    const categoryContainer = document.querySelector(
      ".category-container.education"
    );
    const educationContainer = categoryContainer ? categoryContainer : null;

    if (educationContainer) {
      let existingEntries =
        educationContainer.querySelectorAll(".grid-container");

      let newGridContainer, removeButton;

      if (existingEntries.length > 0) {
        const lastEntry = existingEntries[existingEntries.length - 1];
        newGridContainer = lastEntry.cloneNode(true);

        newGridContainer.querySelectorAll("input").forEach((input) => {
          input.value = "";
        });

        let degreeContainer =
          newGridContainer.querySelector(".degree-container");

        if (!degreeContainer) {
          degreeContainer = document.createElement("div");
          degreeContainer.classList.add("degree-container");

          const degreeInput = newGridContainer.querySelector(".second-title");
          degreeContainer.appendChild(degreeInput);

          removeButton = document.createElement("button");
          removeButton.classList.add("remove");
          removeButton.textContent = "-";
          degreeContainer.appendChild(removeButton);

          newGridContainer.prepend(degreeContainer);
        } else {
          removeButton = degreeContainer.querySelector(".remove");
        }
      } else {
        newGridContainer = document.createElement("div");
        newGridContainer.classList.add("grid-container");

        newGridContainer.innerHTML = `
            <div class="degree-container">
                <input type="text" class="second-title" placeholder="Degree" />
                <button class="remove">-</button>
            </div>

            <div class="date-container">
                <input type="text" class="education-start-date second-title" placeholder="Start Date" />
                <p class="second-title">-</p>
                <input type="text" class="education-end-date second-title" placeholder="End Date" />
            </div>

            <input type="text" class="third-title" placeholder="School Name" />
            <input type="text" class="third-title location" placeholder="Location" />
        `;

        removeButton = newGridContainer.querySelector(".remove");
      }

      removeButton.addEventListener("click", () => {
        newGridContainer.remove();
      });

      newGridContainer.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", function () {
          adjustWidth(this);
        });
      });

      educationContainer.appendChild(newGridContainer);
    }
  });
});
