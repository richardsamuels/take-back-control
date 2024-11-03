const getPreferredTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme: string) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
};

// Set initial theme
setTheme(getPreferredTheme());

// Listen for preference changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    setTheme(getPreferredTheme());
  });
