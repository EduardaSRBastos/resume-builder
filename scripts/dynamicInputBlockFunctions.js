import { adjustWidth } from "../index.js";

// Dynamic description logic
export function handleDescriptionInput(event) {
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

export function addDescriptionBlock(jobDescriptionList) {
  const newLi = document.createElement("li");
  newLi.innerHTML = `<textarea class="text" placeholder="Description"></textarea>`;
  jobDescriptionList.appendChild(newLi);

  newLi
    .querySelector(".text")
    .addEventListener("input", handleDescriptionInput);
}

export function removeDescriptionBlock(jobDescriptionList) {
  const descriptions = jobDescriptionList.querySelectorAll(".text");
  if (
    descriptions.length > 1 &&
    descriptions[descriptions.length - 1].value.trim() === ""
  ) {
    descriptions[descriptions.length - 1].parentNode.remove();
  }
}

// Dynamic skill logic
export function handleSkillInput(event) {
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

export function addSkillBlock(skillList) {
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

export function removeSkillBlock(skillList) {
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

export function getLanguageContainer() {
  return [...document.querySelectorAll(".category-container")].find(
    (container) =>
      container.querySelector("h1")?.textContent.trim() === "Languages"
  );
}

// Dynamic language logic
export function handleLanguageInput(event) {
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

export function addLanguageBlock(languageContainer) {
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

export function removeLanguageBlock(languageContainer) {
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
export function getCertificationContainer() {
  return [...document.querySelectorAll(".category-container")].find(
    (container) =>
      container.querySelector("h1")?.textContent.trim() ===
      "Certifications, Licences & Publications"
  );
}

export function handleCertificationInput(event) {
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

export function addCertificationBlock(certificationContainer) {
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

export function removeCertificationBlock(certificationContainer) {
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
