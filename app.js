document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const taskForm = document.getElementById("taskForm");
    const taskTableBody = document.getElementById("taskTableBody");
    const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));
    const showFormButton = document.getElementById("showFormButton");
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const searchInput = document.getElementById("searchInput"); 
    const priorityFilter = document.getElementById("priorityFilter"); 

    let editingIndex = null;
    let taskToDeleteIndex = null;
    let tasks = loadTasksFromStorage();
    let filteredTasks = tasks; 

    // Load tasks from localStorage
    function loadTasksFromStorage() {
        const storedTasks = localStorage.getItem("tasks");
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    // Save tasks to localStorage
    function saveTasksToStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Render tasks in the table
    function renderTasks() {
        taskTableBody.innerHTML = ""; 
        
        if (filteredTasks.length === 0) {
            // Display a message when no tasks exist
            const emptyRow = document.createElement("tr");
            emptyRow.innerHTML = `
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-tasks fa-2x mb-3" style="color: var(--border-color);"></i>
                    <p>No tasks found. Add a new task to get started!</p>
                </td>
            `;
            taskTableBody.appendChild(emptyRow);
            return;
        }
        
        filteredTasks.forEach((task, index) => {
            const taskRow = document.createElement("tr");
            taskRow.className = "fade-in";
            taskRow.style.animationDelay = `${index * 0.05}s`;
            
            // Get the actual index in the original tasks array
            const originalIndex = tasks.findIndex(t => 
                t.title === task.title && 
                t.description === task.description && 
                t.date === task.date
            );
            
            taskRow.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${formatDate(task.date)}</td>
                <td><span class="priority-badge priority-${task.priority}">${getPriorityLabel(task.priority)}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" data-index="${originalIndex}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" data-index="${originalIndex}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;

            // Assign events to buttons
            taskRow.querySelector(".btn-warning").addEventListener("click", function () {
                editTask(originalIndex);
            });

            taskRow.querySelector(".btn-danger").addEventListener("click", function () {
                deleteTask(originalIndex);
            });

            taskTableBody.appendChild(taskRow);
        });
    }
    
    // Format date to be more readable
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Get priority label based on priority value
    function getPriorityLabel(priority) {
        const labels = {
            "1": "Low",
            "2": "Low-Med",
            "3": "Medium",
            "4": "Medium-High",
            "5": "High"
        };
        return labels[priority] || priority;
    }

    // Add or edit task
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const taskTitle = document.getElementById("taskTitle").value;
        const taskDate = document.getElementById("taskDate").value;
        const taskDescription = document.getElementById("taskDescription").value;
        const taskPriority = document.getElementById("taskPriority").value;

        const newTask = {
            title: taskTitle,
            date: taskDate,
            description: taskDescription,
            priority: taskPriority,
        };

        if (editingIndex === null) {
            tasks.push(newTask); 
            showToast("Task created successfully!");
        } else {
            tasks[editingIndex] = newTask; 
            showToast("Task updated successfully!");
        }

        saveTasksToStorage(); 
        taskForm.reset();
        taskModal.hide();
        editingIndex = null;
        
        // Apply current filters again
        applyFilters();
    });

    // Delete task with confirmation
    function deleteTask(index) {
        taskToDeleteIndex = index;
        confirmDeleteModal.show();
    }

    confirmDeleteButton.addEventListener("click", function () {
        if (taskToDeleteIndex !== null) {
            tasks.splice(taskToDeleteIndex, 1);
            saveTasksToStorage();
            showToast("Task deleted successfully!");
            taskToDeleteIndex = null;
            confirmDeleteModal.hide();
            
            // Apply current filters again
            applyFilters();
        }
    });

    // Edit task
    function editTask(index) {
        editingIndex = index;
        const task = tasks[index];

        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskDate").value = task.date;
        document.getElementById("taskDescription").value = task.description;
        document.getElementById("taskPriority").value = task.priority;

        // Update modal title
        document.getElementById("taskModalLabel").textContent = "Edit Task";
        
        taskModal.show();
    }

    // Show form for new task
    showFormButton.addEventListener("click", function () {
        taskForm.reset();
        editingIndex = null;
        
        // Reset modal title
        document.getElementById("taskModalLabel").textContent = "Add New Task";
        
        taskModal.show();
    });

    // Apply both search and filter
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedPriority = priorityFilter.value;
        
        filteredTasks = tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
            return matchesSearch && matchesPriority;
        });
        
        renderTasks();
    }

    // Search tasks by title
    searchInput.addEventListener("input", applyFilters);

    // Filter tasks by priority
    priorityFilter.addEventListener("change", applyFilters);

    // Show toast notification
    function showToast(message) {
        const toast = new bootstrap.Toast(document.getElementById('toastMessage'));
        const toastBody = document.getElementById('toastBody');
        toastBody.textContent = message; 
        toast.show();
    }

    // Logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser'); 
        window.location.href = 'login.html'; 
    });

    // Initialize task table
    renderTasks();
});