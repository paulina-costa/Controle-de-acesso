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


// Adicionar evento de logout ao botão "sair" no menu suspenso
document.querySelector('.menu-suspenso').addEventListener('click', logout);


// Executar verificação de token ao carregar a página
checkTokenExpiration();

function checkTokenOnLoad() {
    const token = localStorage.getItem('token');

    // Se não houver token, redireciona para login
    if (!token) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../paginaLogin/login.html';
        return;
    }

    // Verifica se o token expirou
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            alert('Sua sessão expirou. Faça login novamente.');
            logout(); // Remove o token e redireciona para o login
        }
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        logout();
    }
}

// Chama a função ao carregar a página
checkTokenOnLoad();


// Logout
function logout() {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Redireciona para a página de login
    window.location.href = '../paginaLogin/login.html';
}


window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};


