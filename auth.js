document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.getElementById('logoutButton');

    const showModal = (message) => {
        const modalMessage = document.getElementById('modalMessage');
        modalMessage.textContent = message; 
        const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
        notificationModal.show(); 
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                showModal('Login successful! Redirecting to your dashboard...');
                sessionStorage.setItem('loggedInUser', username);
                setTimeout(() => window.location.href = 'index.html', 1500); 
            } else {
                showModal('Incorrect username or password. Please try again.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Password validation
            if (password.length < 8) {
                showModal('Password must be at least 8 characters long.');
                return;
            }

            if (password !== confirmPassword) {
                showModal('Passwords do not match. Please try again.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.username === username)) {
                showModal('Username already exists. Please choose another one.');
            } else {
                users.push({ username, password });
                localStorage.setItem('users', JSON.stringify(users));
                showModal('Registration successful! Redirecting to login page...');
                setTimeout(() => window.location.href = 'login.html', 1500); 
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }
});