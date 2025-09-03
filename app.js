class Task {
    constructor(id, text, done = false) {
        this.id = id;
        this.text = text;
        this.done = done;
    }
}

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    }

    addTask(text) {
        const id = Date.now();
        const task = new Task(id, text);
        this.tasks.push(task);
        this.save();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.done = !task.done;
            this.save();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
    }

    editTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
            this.save();
        }
    }

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
}

// === UI Control ===
const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

const taskManager = new TaskManager();

function render() {
    list.innerHTML = "";
    taskManager.tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.done ? "done" : ""}`;
        li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;
        list.appendChild(li);
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        taskManager.addTask(text);
        input.value = "";
        render();
    }
});

// === Global functions (biar bisa dipanggil dari onclick) ===
function toggleTask(id) {
    taskManager.toggleTask(id);
    render();
}

function deleteTask(id) {
    taskManager.deleteTask(id);
    render();
}

function editTask(id) {
    const newText = prompt("Edit task:");
    if (newText) {
        taskManager.editTask(id, newText);
        render();
    }
}

// pertama kali load
render();

