function showPopup(message, isError = true, callback = null) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');

    // Limpa as classes anteriores
    popup.classList.remove('popup-success', 'popup-error');

    // Define a cor de fundo dependendo do tipo de mensagem
    if (isError) {
        popup.classList.add('popup-error'); // Vermelho para erro
    } else {
        popup.classList.add('popup-success'); // Verde para sucesso
    }

    // Define a mensagem do popup
    popupMessage.textContent = message;

    // Exibe o popup com transição
    popup.classList.add('show');

    // Fecha automaticamente após 5 segundos e chama o callback
    setTimeout(() => {
        popup.classList.remove('show');
        if (callback) {
            callback(); // Chama a função de callback após o popup desaparecer
        }
    }, 2500);
}

// Função de logout
function logout() {
    localStorage.removeItem('token'); // Remove o token
    localStorage.removeItem('email');
    localStorage.removeItem('nomeUsuario');
    window.location.href = '../paginaLogin/login.html'; // Redireciona para a página de login
}

function checkTokenOnLoad() {
    const token = localStorage.getItem('token');

    if (!token) {
        // Sem token: redireciona para login
        showPopup('Você precisa estar logado para acessar esta página!', true);
        window.location.href = '../paginaLogin/login.html';
        return;
    }

    try {
        // Decodificar o payload do token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            // Token expirado: remove o token e redireciona
            showPopup('Sua sessão expirou. Faça login novamente.', true);;
            logout();
        }
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        showPopup('Houve um problema com sua autenticação. Faça login novamente.', true);
        logout();
    }
}


// Previne o acesso às páginas protegidas ao usar a seta "voltar"
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

// Exporte as funções (caso precise importar em outro lugar)
export { checkTokenOnLoad, logout, showPopup };
