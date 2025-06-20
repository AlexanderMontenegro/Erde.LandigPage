
const toggleTheme = () => {
  document.body.classList.toggle("dark");
};

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "theme-toggle";
  toggleBtn.textContent = "🌙";
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
});

