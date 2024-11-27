function checkTokenOnLoad() {
    const token = localStorage.getItem('token');

    if (!token) {
        // Sem token: redireciona para login
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../paginaLogin/login.html';
        return;
    }

    try {
        // Decodificar o payload do token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            // Token expirado: remove o token e redireciona
            alert('Seu token expirou. Faça login novamente.');
            logout();
        }
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        alert('Houve um problema com sua autenticação. Faça login novamente.');
        logout();
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('token'); // Remove o token
    localStorage.removeItem('email');
    localStorage.removeItem('nomeUsuario');
    window.location.href = '../paginaLogin/login.html'; // Redireciona para a página de login
}

// Previne o acesso às páginas protegidas ao usar a seta "voltar"
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

// Exporte as funções (caso precise importar em outro lugar)
export { checkTokenOnLoad, logout };
