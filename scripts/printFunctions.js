// Add links in print and hide empty fields
export function hideEmptyFields() {
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

  document
    .querySelectorAll('.second-title[placeholder="Language"]')
    .forEach((input) => {
      if (input && input.value) {
        input.value = `${input.value}:`;
      }
    });
}

export function prepareForPrint() {
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

export function restoreHiddenFields() {
  document
    .querySelectorAll("input, textarea, ul li, h1, hr, p")
    .forEach((element) => {
      if (element.id !== "load-file") {
        element.style.display = "";
      }
    });

  document
    .querySelectorAll('.second-title[placeholder="Language"]')
    .forEach((input) => {
      if (input && input.value.endsWith(":")) {
        input.value = input.value.slice(0, -1);
      }
    });
}

export function cleanupAfterPrint() {
  document.querySelectorAll(".contact-print").forEach((link) => link.remove());
  document
    .querySelectorAll(".contact")
    .forEach((input) => (input.style.display = "block"));
}
