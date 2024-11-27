// Função central para verificar a validade do token
function verificarToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../paginaLogin/login.html';
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            alert('Sua sessão expirou. Faça login novamente.');
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

// Função para fazer requisição com verificação do token
function fazerRequisicaoComToken(url, options) {
    const token = verificarToken(); // Verifica a validade do token

    if (!token) {
        return; // Se o token for inválido ou expirado, não faz a requisição
    }

    // Adiciona o token no cabeçalho da requisição
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data);
            // Aqui você pode processar os dados recebidos (ex: atualizar a tabela com os resultados)
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
}

// Função de logout
function logout() {
    localStorage.removeItem('token'); // Remove o token
    window.location.href = '../paginaLogin/login.html'; // Redireciona para a página de login
}

// Garantir que o código seja executado após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verifica o token ao carregar a página
    verificarToken();  // Verifica o token ao carregar a página (já vai fazer logout caso necessário)

    // Adicionar evento de logout ao botão "sair" no menu suspenso
    const menuSuspenso = document.querySelector('.menu-suspenso');
    if (menuSuspenso) {
        menuSuspenso.addEventListener('click', logout);
    }

    // Caso tenha algum outro comportamento para o menu suspenso ou mais ajustes
});
