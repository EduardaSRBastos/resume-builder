import {
  addProfessionalExperience,
  addEducation,
} from "./scripts/addBlockFunctions.js";
import {
  handleDescriptionInput,
  handleSkillInput,
  handleLanguageInput,
  getCertificationContainer,
  handleCertificationInput,
  getLanguageContainer,
} from "./scripts/dynamicInputBlockFunctions.js";
import {
  prepareForPrint,
  cleanupAfterPrint,
  hideEmptyFields,
  restoreHiddenFields,
} from "./scripts/printFunctions.js";
import { saveToFile, loadFromFile } from "./scripts/fileFunctions.js";

// Clear page
export function clearAllFields() {
  document.querySelectorAll("input, textarea").forEach((element) => {
    element.value = "";
  });

  const professionalExperienceSection = document.querySelector(
    ".category-container.work-experience"
  );

  professionalExperienceSection
    .querySelectorAll(".grid-container")
    .forEach((container, index) => {
      if (index > 0) {
        container.remove();
        professionalExperienceSection
          .querySelectorAll("li")
          .forEach((textarea) => {
            textarea.remove();
          });
      }
    });

  const educationSection = document.querySelector(
    ".category-container.education"
  );

  educationSection
    .querySelectorAll(".grid-container")
    .forEach((container, index) => {
      if (index > 0) {
        container.remove();
      }
    });

  document.querySelectorAll(".skill-list").forEach((container, index) => {
    if (index > 0) {
      container.remove();
    }
  });

  const languageContainer = getLanguageContainer();
  if (languageContainer) {
    languageContainer
      .querySelectorAll('.second-title[placeholder="Language"]')
      .forEach((el, index) => {
        if (index > 0) el.remove();
      });
    languageContainer
      .querySelectorAll("#language-divider")
      .forEach((el, index) => {
        if (index > 0) el.remove();
      });
    languageContainer
      .querySelectorAll('.third-title[placeholder="CEFR Level"]')
      .forEach((el, index) => {
        if (index > 0) el.remove();
      });
  }

  const certificationContainer = getCertificationContainer();
  if (certificationContainer) {
    certificationContainer
      .querySelectorAll("#certification-input")
      .forEach((el, index) => {
        if (index > 0) el.remove();
      });
  }
}

// Dynamic input sizes
export function adjustWidth(input) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const font = getComputedStyle(input).font;
  context.font = font;
  const textWidth = context.measureText(
    input.value || input.placeholder || " "
  ).width;
  input.style.width = `${textWidth + 5}px`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Reset input fields on page refresh
  clearAllFields();

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

  // Print logic
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

  // Save and load to file logic
  document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
  });

  document.getElementById("saveFileBtn").addEventListener("click", saveToFile);

  document.getElementById("loadFileBtn").addEventListener("click", function () {
    document.getElementById("load-file").click();
  });

  document
    .getElementById("load-file")
    .addEventListener("change", function (event) {
      loadFromFile(event);
    });

  // Add professional experience and education logic
  addProfessionalExperience();
  addEducation();
});
