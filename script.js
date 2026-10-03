const form = document.querySelector('#task-form');
const input = document.querySelector('#new-task');
const list = document.querySelector('#task-list');
const template = document.querySelector('#task-template');
const summary = document.querySelector('#task-summary');
const emptyState = document.querySelector('#empty-state');
const clearCompleted = document.querySelector('#clear-completed');
const progressText = document.querySelector('#progress-text');
const progressRing = document.querySelector('.ring-value');
const todayLabel = document.querySelector('#today-label');

const storageKey = 'focus-list-tasks';
let tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');

todayLabel.textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase();

function saveTasks() { localStorage.setItem(storageKey, JSON.stringify(tasks)); }

function updateStatus() {
  const completed = tasks.filter((task) => task.done).length;
  const total = tasks.length;
  const remaining = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  summary.textContent = total === 0 ? 'No tasks yet — add your first one.' : `${remaining} task${remaining === 1 ? '' : 's'} left`;
  progressText.textContent = `${percent}%`;
  progressRing.style.strokeDashoffset = 100.53 - (100.53 * percent) / 100;
  emptyState.classList.toggle('visible', total === 0);
  clearCompleted.hidden = completed === 0;
}

function renderTasks() {
  list.replaceChildren();
  tasks.forEach((task) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector('input');
    checkbox.checked = task.done;
    item.classList.toggle('completed', task.done);
    item.querySelector('.task-title').textContent = task.title;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });
    item.querySelector('.delete-task').addEventListener('click', () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });
    list.append(item);
  });
  updateStatus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  tasks.unshift({ id: crypto.randomUUID(), title, done: false });
  saveTasks();
  input.value = '';
  renderTasks();
  input.focus();
});

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
});

renderTasks();
