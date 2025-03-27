import { adjustWidth } from "../index.js";
import { handleDescriptionInput } from "./dynamicInputBlockFunctions.js";

// Add new professional experience logic
export function addProfessionalExperience() {
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

        newDescriptionList
          .querySelector(".text")
          .addEventListener("input", handleDescriptionInput);

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

        newDescriptionList
          .querySelector(".text")
          .addEventListener("input", handleDescriptionInput);

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

      document.querySelectorAll("input").forEach((input) => {
        adjustWidth(input);
        input.addEventListener("input", function () {
          adjustWidth(this);
        });
      });
    }
  });
}

// Add new education logic
export function addEducation() {
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
      educationContainer.appendChild(newGridContainer);

      document.querySelectorAll("input").forEach((input) => {
        adjustWidth(input);
        input.addEventListener("input", function () {
          adjustWidth(this);
        });
      });
    }
  });
}
