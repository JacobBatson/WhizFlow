document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInputField = document.getElementById('taskInput');
  const taskInput = taskInputField.value.trim();
  const feedback = document.getElementById('feedback');

  if (!taskInput) {
      feedback.textContent = "Please enter a task description!";
      feedback.style.color = "#e53e3e";
      return;
  }

  feedback.textContent = `Task successfully created: "${taskInput}"`;
  feedback.style.color = "#38a169"; 

  
  taskInputField.value = '';
});
