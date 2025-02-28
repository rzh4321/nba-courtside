import { useState, useEffect } from "react";

export default function useTheme() {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const isDarkMode = 
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark === undefined) return;
    
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  return { isDark, toggleTheme };
}