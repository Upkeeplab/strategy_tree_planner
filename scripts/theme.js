// Remove all themes
function clearThemes() {
  document.body.classList.remove(
    "dark-theme",
    "light-theme",
    "halloween-theme",
    "winter-theme",
  );
}

// Set theme
function setTheme(theme) {
  clearThemes();

  document.body.classList.add(theme);

  localStorage.setItem("theme", theme);
}

// Load saved theme
const savedTheme = localStorage.getItem("theme");
const select = document.getElementById("themeSelect");

if (savedTheme) {
  setTheme(savedTheme);
} else {
  setTheme("blue-theme");
}


if (savedTheme) {
      select.value = savedTheme;
    }
// Change theme
select.addEventListener("change", () => {
      setTheme(select.value);
    });