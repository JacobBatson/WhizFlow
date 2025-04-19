document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInputField = document.getElementById('taskInput');
  const taskInput = taskInputField.value.trim();
  const feedback = document.getElementById('feedback');
  const taskList = document.getElementById('taskList');

  if (!taskInput) {
    feedback.textContent = "⚠️ Please enter a task description!";
    feedback.style.color = "#e53e3e";
    feedback.style.animation = "fadeFeedback 0.5s forwards";
    return;
  }

  const listItem = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');

  const taskText = document.createElement('span');
  taskText.textContent = taskInput;

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.classList.add('delete-btn');

  checkbox.addEventListener('change', () => {
    taskText.classList.toggle('completed', checkbox.checked);
  });

  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(listItem);
  });

  listItem.appendChild(checkbox);
  listItem.appendChild(taskText);
  listItem.appendChild(deleteBtn);
  taskList.appendChild(listItem);

  feedback.textContent = `✅ Task created: "${taskInput}"`;
  feedback.style.color = "#38a169";
  feedback.style.animation = "fadeFeedback 0.5s forwards";

  taskInputField.value = '';
});