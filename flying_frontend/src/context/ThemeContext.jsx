import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;

    if (theme === "dark") {
      // Dark Mode Variables
      root.style.setProperty("--bg-layout", "#121214");
      root.style.setProperty("--bg-surface", "#1E1E2D");
      root.style.setProperty("--bg-card", "#1A1A26");
      root.style.setProperty("--bg-table-th", "#161622");
      root.style.setProperty("--text-main", "#ffffff");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--text-td", "#cbd5e1");
      root.style.setProperty("--border-main", "#2b2b40");
      root.style.setProperty("--border-light", "#222235");
      root.style.setProperty("--shadow-light", "rgba(0,0,0,0.2)");
    } else {
      // Light Mode Variables
      root.style.setProperty("--bg-layout", "#f5f7fb");
      root.style.setProperty("--bg-surface", "#ffffff");
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--bg-table-th", "#f8fafc");
      root.style.setProperty("--text-main", "#1e293b");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--text-td", "#334155");
      root.style.setProperty("--border-main", "#e5e7eb");
      root.style.setProperty("--border-light", "#f1f5f9");
      root.style.setProperty("--shadow-light", "rgba(0,0,0,0.04)");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);