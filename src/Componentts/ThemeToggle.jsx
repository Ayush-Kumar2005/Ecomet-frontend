import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || !("theme" in localStorage)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-14 h-7 flex items-center bg-slate-700 dark:bg-emerald-950/50 rounded-full p-1 cursor-pointer transition-colors duration-300 border border-slate-600 dark:border-emerald-500/30"
    >
      <div
        className={`bg-white dark:bg-emerald-400 w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center ${
          darkMode ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {darkMode ? (
          <FaMoon className="text-[10px] text-slate-900" aria-hidden />
        ) : (
          <FaSun className="text-[10px] text-amber-500" aria-hidden />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
