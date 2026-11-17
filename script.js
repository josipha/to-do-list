let tasks = JSON.parse(localStorage.getItem("friendTasks")) || [];
let currentFilter = "all";

// Save tasks in Local Storage
function saveTasks() {
    localStorage.setItem("friendTasks", JSON.stringify(tasks));
}

// Create a new task
function addTask() {
    let input = document.getElementById("taskInput");
    let taskName = input.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    let newTask = {
        id: Date.now(),
        name: taskName,
        completed: false
    };

    tasks.push(newTask);

    input.value = "";
    saveTasks();
    displayTasks();
}

// Display tasks
function displayTasks() {
    let list = document.getElementById("taskList");
    let searchValue = document.getElementById("searchInput")
                            .value.toLowerCase();

    list.innerHTML = "";

    let result = tasks.filter(item => {
        let searchMatch = item.name.toLowerCase()
                                  .includes(searchValue);

        let filterMatch =
            currentFilter === "all" ||
            (currentFilter === "pending" && !item.completed) ||
            (currentFilter === "completed" && item.completed);

        return searchMatch && filterMatch;
    });

    if (result.length === 0) {
        list.innerHTML = "<p>No tasks available!</p>";
    }

    result.forEach(item => {
        let li = document.createElement("li");

        if (item.completed) {
            li.classList.add("completed");
        }

        let name = document.createElement("span");
        name.textContent = item.name;

        let doneBtn = document.createElement("button");
        doneBtn.textContent = item.completed ? "Undo" : "Done";
        doneBtn.onclick = () => changeStatus(item.id);

        let updateBtn = document.createElement("button");
        updateBtn.textContent = "Edit";
        updateBtn.onclick = () => updateTask(item.id);

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete";
        removeBtn.onclick = () => removeTask(item.id);

        li.append(name, doneBtn, updateBtn, removeBtn);
        list.appendChild(li);
    });

    updateCount();
}

// Change task status
function changeStatus(id) {
    tasks = tasks.map(item => {
        if (item.id === id) {
            item.completed = !item.completed;
        }
        return item;
    });

    saveTasks();
    displayTasks();
}

// Update task
function updateTask(id) {
    let selected = tasks.find(item => item.id === id);

    let updatedName = prompt("Enter the new task:", selected.name);

    if (updatedName === null) return;

    if (updatedName.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    selected.name = updatedName.trim();

    saveTasks();
    displayTasks();
}

// Remove task
function removeTask(id) {
    if (confirm("Do you want to delete this task?")) {
        tasks = tasks.filter(item => item.id !== id);

        saveTasks();
        displayTasks();
    }
}

// Filter tasks
function setFilter(value) {
    currentFilter = value;
    displayTasks();
}

// Update task count
function updateCount() {
    let total = tasks.length;
    let finished = tasks.filter(item => item.completed).length;
    let remaining = total - finished;

    document.getElementById("total").textContent = total;
    document.getElementById("remaining").textContent = remaining;
    document.getElementById("finished").textContent = finished;
}

// Clear completed tasks
function clearCompleted() {
    if (confirm("Clear all finished tasks?")) {
        tasks = tasks.filter(item => !item.completed);

        saveTasks();
        displayTasks();
    }
}

// Load saved tasks
displayTasks();