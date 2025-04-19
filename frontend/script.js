document.getElementById('taskForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const taskInputField = document.getElementById('taskInput');
  const taskInput = taskInputField.value.trim();
  const feedback = document.getElementById('feedback');
  const loader = document.getElementById('loader');

  if (!taskInput) {
    feedback.textContent = "⚠️ Please enter a task description!";
    feedback.style.color = "#e53e3e";
    feedback.classList.add('show');
    return;
  }

  feedback.textContent = "";
  feedback.classList.remove('show');
  loader.style.display = 'block';

  try {
    const response = await fetch('https://api.whizflow.app/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: taskInput })
    });

    const result = await response.json();
    loader.style.display = 'none';

    if (response.ok) {
      feedback.textContent = `✅ Task created: ${result.message || taskInput}`;
      feedback.style.color = "#38a169";
      updateHistory(taskInput);
    } else {
      feedback.textContent = `❌ Error: ${result.error || 'Something went wrong.'}`;
      feedback.style.color = "#e53e3e";
    }

  } catch (err) {
    loader.style.display = 'none';
    feedback.textContent = "❌ Network error. Please try again later.";
    feedback.style.color = "#e53e3e";
  }

  feedback.classList.add('show');
  setTimeout(() => feedback.classList.remove('show'), 4000);
  taskInputField.value = '';
});

let taskHistory = [];

function updateHistory(task) {
  taskHistory.unshift(task);
  taskHistory = taskHistory.slice(0, 5); // show last 5
  document.getElementById('history').innerHTML = `
    <h3>📝 Recent Tasks</h3>
    <ul>${taskHistory.map(t => `<li>${t}</li>`).join('')}</ul>
  `;
}

// frontend/script.js

(async function ensureLoggedIn() {
    try {
      const res = await fetch('/api/me');
      const { user } = await res.json();
      if (!user) {
        // Not authenticated → send them to login page
        return window.location.replace('/login.html');
      }
      // if user exists, you can optionally show their name somewhere:
      console.log('Logged in as:', user.email);
    } catch (err) {
      console.error('Auth check failed:', err);
      window.location.replace('/login.html');
    }
  })();
  