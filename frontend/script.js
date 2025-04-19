document.getElementById('taskForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const taskInputField = document.getElementById('taskInput');
  const taskInput = taskInputField.value.trim();
  const feedback = document.getElementById('feedback');

  if (!taskInput) {
    feedback.textContent = "Please enter a task description!";
    feedback.style.color = "#e53e3e"; // red
    return;
  }

  try {
    const response = await fetch('https://api.whizflow.app/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: taskInput })
    });

    const result = await response.json();

    if (response.ok) {
      feedback.textContent = `Task created: ${result.message || taskInput}`;
      feedback.style.color = "#38a169"; // green
    } else {
      feedback.textContent = `Error: ${result.error || 'Something went wrong.'}`;
      feedback.style.color = "#e53e3e"; // red
    }
  } catch (err) {
    feedback.textContent = "Network error. Please try again later.";
    feedback.style.color = "#e53e3e"; // red
  }

  taskInputField.value = '';
});