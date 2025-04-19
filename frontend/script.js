document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInput = document.getElementById('taskInput').value.trim();
  const feedback = document.getElementById('feedback');

  if (!taskInput) {
      feedback.textContent = "Please enter a task description!";
      feedback.style.color = "#e53e3e"; // Red for error
      return;
  }

  feedback.textContent = `Task successfully created: "${taskInput}"`;
  feedback.style.color = "#38a169"; // Green for success
});