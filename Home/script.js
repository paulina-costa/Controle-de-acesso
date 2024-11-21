// Verificar token e expiração
function checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../paginaLogin/login.html';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;

    if (payload.exp < now) {
        alert('Sua sessão expirou. Faça login novamente.');
        logout();
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '../paginaLogin/login.html';
}

// Adicionar evento de logout ao botão "sair" no menu suspenso
document.querySelector('.menu-suspenso img[alt="Sair"]').addEventListener('click', logout);

// Executar verificação de token ao carregar a página
checkTokenExpiration();
