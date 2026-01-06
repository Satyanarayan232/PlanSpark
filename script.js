const todo = document.getElementById('todo');
const progress = document.getElementById('progress');
const done = document.getElementById('done');

let draggedTask = null;

/* ---------- SAVE ---------- */
function saveTasks() {
    const tasks = [];

    [todo, progress, done].forEach(col => {
        col.querySelectorAll('.task').forEach(task => {
            tasks.push({
                title: task.querySelector('h3').innerText,
                desc: task.querySelector('p').innerText,
                column: col.id
            });
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/* ---------- LOAD ---------- */
function loadTasks() {
    const data = JSON.parse(localStorage.getItem('tasks')) || [];

    data.forEach(t => {
        const task = createTask(t.title, t.desc);
        document.getElementById(t.column).appendChild(task);
    });
}

/* ---------- CREATE TASK ---------- */
function createTask(title, desc) {
    const div = document.createElement('div');
    div.className = 'task';
    div.draggable = true;

    div.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    div.addEventListener('dragstart', () => draggedTask = div);

    div.querySelector('button').addEventListener('click', () => {
        div.remove();
        saveTasks();
    });

    return div;
}

/* ---------- DRAG & DROP ---------- */
[todo, progress, done].forEach(col => {
    col.addEventListener('dragover', e => e.preventDefault());

    col.addEventListener('drop', () => {
        if (draggedTask) {
            col.appendChild(draggedTask);
            draggedTask = null;
            saveTasks();
        }
    });
});

/* ---------- MODAL ---------- */
const modal = document.querySelector('.modal');
document.getElementById('toggle-modal').onclick = () => modal.classList.add('active');
document.querySelector('.modal .bg').onclick = () => modal.classList.remove('active');

/* ---------- ADD TASK ---------- */
document.getElementById('add-new-task').onclick = () => {
    const title = document.getElementById('task-title-input').value.trim();
    const desc = document.getElementById('task-desc-input').value.trim();

    if (!title) return alert('Title required');

    const task = createTask(title, desc);
    todo.appendChild(task);
    saveTasks();

    document.getElementById('task-title-input').value = '';
    document.getElementById('task-desc-input').value = '';
    modal.classList.remove('active');
};

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', loadTasks);
