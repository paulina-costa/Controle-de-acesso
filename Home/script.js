function showPopup(message, type = 'success') {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = message;
    popup.className = `popup show ${type}`;

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        showPopup('Você precisa estar logado para acessar esta página.', 'error');
        logout();
        setTimeout(() => {
            window.location.href = '../paginaLogin/login.html';
        }, 1500);
        return;
    }

    // Função para carregar os dados do usuário logado
    function carregarDadosUsuario() {
        const nomeUsuario = localStorage.getItem('nomeUsuario');
        const email = localStorage.getItem('email');

        if (nomeUsuario && email) {
            document.getElementById('nomeUsuario').textContent = nomeUsuario;
            document.getElementById('emailUsuario').textContent = email;
        } else {
            showPopup('Usuário não encontrado no localStorage.', 'error');
        }
    }

    // Chama a função para carregar os dados ao carregar a página
    carregarDadosUsuario();

    // Adicionar evento de logout ao botão "sair" no menu suspenso
    const botaoSair = document.getElementById('botaoSair');
    if (botaoSair) {
        botaoSair.addEventListener('click', function (event) {
            event.preventDefault(); // Impede o link de redirecionar imediatamente
            showPopup('Você foi desconectado.', 'success'); // Exibe o popup
            localStorage.removeItem('token'); // Remove o token
            localStorage.removeItem('email');
            localStorage.removeItem('nomeUsuario');
            setTimeout(() => {
                window.location.href = '../paginaLogin/login.html'; // Redireciona após o popup
            }, 1500); // Atraso de 1,5 segundos para mostrar o popup
        });
    }


    // Função para verificar a validade do token
    function verificarToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            showPopup('Sua sessão expirou. Faça login novamente.', 'error');
            logout();
            window.location.href = '../paginaLogin/login.html';
            return null;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
            const now = Date.now() / 1000; // Timestamp atual em segundos

            if (payload.exp < now) {
                showPopup('Sua sessão expirou. Faça login novamente.', 'error');
                logout(); // Remove o token e redireciona para o login
                return null;
            }

            return token; // Retorna o token válido
        } catch (error) {
            console.error('Erro ao verificar o token:', error);
            logout();
            return null;
        }
    }

    // Função de logout
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('nomeUsuario');
        showPopup('Você foi desconectado.', 'success');
        setTimeout(() => {
            window.location.href = '../paginaLogin/login.html'; // Redireciona para o login
        }, 1500);
    }

    // Verifica a validade do token ao carregar a página
    verificarToken();  // Verifica o token ao carregar a página (já vai fazer logout caso necessário)

});
