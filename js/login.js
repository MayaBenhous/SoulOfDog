function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`https://soulofdog-server.onrender.com/api/users/login`)
        .then((response) => response.json())
        .then((dataDogs) => initOwnerHomePage(dataDogs));

    fetch(`https://soulofdog-server.onrender.com/api/users/login`, {
        method: 'GET',
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
                window.location.href = '/dashboard';
            } else {
                document.getElementById('error-message').innerText = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'An error occurred. Please try again.';
    });
}