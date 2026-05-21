const THEME_KEY = "numerologyStudioTheme";

/**
 * Initializes the theme from localStorage or system preference.
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = savedTheme || systemTheme;
  
  applyTheme(theme);
}

/**
 * Toggles the theme between light and dark.
 */
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = currentTheme === "light" ? "dark" : "light";
  
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
}

/**
 * Applies the theme to the document element.
 */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  
  // Update toggle button accessibility
  const toggleBtn = document.querySelector("#themeToggle");
  if (toggleBtn) {
    const isDark = theme === "dark";
    toggleBtn.setAttribute("aria-label", `Switch to ${isDark ? 'light' : 'dark'} mode`);
    toggleBtn.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
  }
}
