window.onload = () => {
    const userId = sessionStorage.getItem('userId');
    getDataUser(userId);
};