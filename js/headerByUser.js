function getDataUser(userId) {
    fetch(`https://soulofdog-server.onrender.com/api/users/userData/${userId}`)
    .then((response) => response.json())
    .then((userData) => initUser(userData));
}

function initUser(user) {
    document.getElementById('userName').textContent = user.firstName;
    const userImg = document.getElementById('userImg');
    userImg.src = user.img;
    userImg.alt = user.firstName;

    document.getElementById('userSelect').addEventListener('change', function() {
        const selectedValue = this.value;
        if (selectedValue === 'logout') {
            sessionStorage.removeItem('userId');
            window.location.href = 'index.html';
        }
    });

    if (user.userType === 'owner') {
        const navItems = document.getElementById('navItems');

        const graphsNavItem = document.createElement('li');
        graphsNavItem.classList.add('nav-item');

        const graphsIcon = document.createElement('span');
        graphsIcon.classList.add('icon-behavior');
        graphsIcon.classList.add('iconNotActive');

        const graphsLink = document.createElement('a');
        graphsLink.classList.add('nav-link');
        graphsLink.href = 'behavior.html';
        graphsLink.textContent = 'Behavior';

        if (window.location.pathname.endsWith('behavior.html')) {
            graphsLink.classList.add('active');
            graphsIcon.classList.remove('iconNotActive');
        }

        graphsNavItem.appendChild(graphsIcon);
        graphsNavItem.appendChild(graphsLink);

        navItems.appendChild(graphsNavItem);

        const scheduleNavItem = navItems.querySelector('.nav-item .scheduleIcon');
        if (scheduleNavItem) {
          scheduleNavItem.parentElement.remove();
        }
    }
}