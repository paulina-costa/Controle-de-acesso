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

// Função para carregar os dados do usuário logado
function carregarDadosUsuario() {
    // Recupera os dados do localStorage
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const email = localStorage.getItem('email');

    // Verifica se os dados existem no localStorage
    if (nomeUsuario && email) {
        // Atualiza os elementos com os dados
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
        document.getElementById('emailUsuario').textContent = email;
    } else {
        // Se não houver dados no localStorage, pode exibir uma mensagem de erro ou redirecionar
        console.log('Usuário não encontrado no localStorage.');
    }
}

// Chama a função para carregar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDadosUsuario);
