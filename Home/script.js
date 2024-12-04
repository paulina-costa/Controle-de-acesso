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
    localStorage.removeItem('email');
    localStorage.removeItem('nomeUsuario');
    window.location.href = '../paginaLogin/login.html'; // Redireciona para a página de login
}

// Garantir que o código seja executado após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verifica o token ao carregar a página
    verificarToken();  // Verifica o token ao carregar a página (já vai fazer logout caso necessário)

    // Adicionar evento de logout ao botão "sair" no menu suspenso
    const botaoSair = document.getElementById('botaoSair');  // Seleciona o botão de logout
    if (botaoSair) {
        botaoSair.addEventListener('click', function(event) {
            event.stopPropagation(); // Impede que o clique no botão "Sair" feche o menu
            logout(); // Chama a função de logout
        });
    }

    // Caso tenha algum outro comportamento para o menu suspenso ou mais ajustes
});