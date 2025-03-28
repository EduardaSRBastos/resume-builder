import { adjustWidth } from "../index.js";
import {
  addSkillBlock,
  addLanguageBlock,
  getLanguageContainer,
  handleDescriptionInput,
  getCertificationContainer,
  handleCertificationInput,
} from "./dynamicInputBlockFunctions.js";

function clearAllFields() {
  document.querySelectorAll("input[type='text']").forEach((input) => {
    input.value = "";
  });

  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.value = "";
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
      .forEach((el) => el.remove());
    languageContainer
      .querySelectorAll("#language-divider")
      .forEach((el) => el.remove());
    languageContainer
      .querySelectorAll('.third-title[placeholder="CEFR Level"]')
      .forEach((el) => el.remove());
  }

  const certificationContainer = getCertificationContainer();
  if (certificationContainer) {
    certificationContainer
      .querySelectorAll("#certification-input")
      .forEach((el) => el.remove());
  }
}

// Save to file logic
export function saveToFile() {
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
export function loadFromFile(event) {
  let file = event.target.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = function (event) {
    let jsonData = JSON.parse(event.target.result);

    clearAllFields();

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

    if (certificationContainer) {
      let existingH1 = certificationContainer.querySelector("h1");

      if (!existingH1) {
        existingH1 = document.createElement("h1");
        existingH1.id = "certifications-title";
        existingH1.textContent = "Certifications, Licences & Publications";
        certificationContainer.prepend(existingH1);
      }

      certificationContainer
        .querySelectorAll("#certification-input")
        .forEach((el) => el.remove());

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
    }
  };

  reader.readAsText(file);
}
