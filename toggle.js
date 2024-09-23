document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".toggleTheme");
  const toggleText = document.querySelector("#toggle-text");
  const body = document.body;

  // Check the current theme from local storage
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    body.style.background = "var(--bg-image)";
    body.style.backgroundSize = "cover";
    document.body.classList.add("dark");
    toggleButton.classList.add("dark");
    toggleText.textContent = "Dark Mode"; // dafualt
    toggleText.style.color = "#ffffff";
  } else {
    body.style.background = "var(--main-bg-color)";
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundSize = "100% 100%";
    body.style.minHeight = "100%";

    toggleText.textContent = "Light Mode"; // dafualt
    toggleText.style.color = "#000000";
  }

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleButton.classList.toggle("dark");

    // Save the current theme in local storage
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);

    // Update toggle text based on the current theme
    if (document.body.classList.contains("dark")) {
      toggleButton.style.backgroundColor = "#bbb";
      body.style.background = "var(--bg-image)";
      body.style.backgroundSize = "cover";

      toggleText.textContent = "Dark Mode"; // Display "Dark Mode" when dark theme is active
      toggleText.style.color = "#ffffff"; // Set text color to white
    } else {
      toggleButton.style.backgroundColor = "#000";
      body.style.background = "var(--main-bg-color)";
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundSize = "100% 100%";
      body.style.minHeight = "100%";

      toggleText.textContent = "Light Mode"; // Display "Light Mode" when light theme is active
      toggleText.style.color = "#000000"; // Set text color to black
    }
  });
});
