function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`https://soulofdog-server.onrender.com/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: username,
            password: password
        })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('userId', data.userId);
                window.location.href = `index.html`;
            } else {
                document.getElementById('error-message').innerText = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'An error occurred. Please try again.';
    });
}