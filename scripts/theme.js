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
  if (select) {
    select.value = savedTheme;
  }
} else {
  setTheme("blue-theme");
}
    
// Change theme
if (select) {
  select.addEventListener("change", () => {
        setTheme(select.value);
      });
}