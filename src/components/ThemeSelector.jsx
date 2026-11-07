import React, { useEffect, useState } from "react";

const themes = [
  "blue-theme",
  "dark-theme",
  "light-theme",
  "halloween-theme",
  "winter-theme"
];

export default function ThemeSelector() {

  const [theme, setTheme] = useState("blue-theme");

  // Load saved theme on startup
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");
    if(savedTheme){
      applyTheme(savedTheme);
    }
    else{
      applyTheme("blue-theme");
    }
  }, []);


  function applyTheme(newTheme){
    document.body.classList.remove(
      "dark-theme",
      "light-theme",
      "halloween-theme",
      "winter-theme",
      "blue-theme"
    );

    document.body.classList.add(newTheme);
    localStorage.setItem(
      "theme",
      newTheme
    );
    setTheme(newTheme);
  }

  return (
    <select
      id="themeSelect"
      value={theme}
      onChange={(e) => applyTheme(e.target.value)}
    >
      {
        themes.map((item)=>(
          <option key={item} value={item}>
            {item}
          </option>
        ))
      }
    </select>
  );
}