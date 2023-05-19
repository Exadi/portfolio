import React, { useEffect, useState } from "react";
import styles from "./ThemeModeSwitcher.module.scss";

function ThemeModeSwitcher() {
  /*light and dark mode switching */
  const body = document.body;
  const lightMode = "light-mode";
  const darkMode = "dark-mode";
  const [mode, setMode] = useState(lightMode);

  //default to dark mode if that's the user's preference.
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode(darkMode);
    }
  }, []);

  useEffect(() => {
    if (mode === lightMode) {
      body.classList.remove(darkMode);
      body.classList.add(lightMode);
    } else {
      body.classList.remove(lightMode);
      body.classList.add(darkMode);
    }
  }, [mode, body.classList]);

  return (
    <label title="Light/Dark mode switch" className={styles["switch"]}>
      <input
        type="checkbox"
        checked={mode === darkMode}
        onChange={(e) =>
          e.target.checked ? setMode(darkMode) : setMode(lightMode)
        }
      />
      <span className={`${styles["slider"]} ${styles["round"]}`}></span>
    </label>
  );
}

export default ThemeModeSwitcher;
