// Função para exibir o popup
function showPopup(message, type = 'success') {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.className = `show ${type}`; // Adiciona as classes apropriadas

    setTimeout(() => {
        popup.classList.remove('show'); // Remove a exibição do popup após 3 segundos
    }, 3000);
}

// Função para logout do usuário
function logout() {
    showPopup('Você foi desconectado.', 'error');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('nomeUsuario');
    setTimeout(() => {
        window.location.href = '../paginaLogin/login.html'; // Redireciona para a página de login
    }, 1500);
}

// Função para verificar a validade do token
function verificarToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        showPopup('Sua sessão expirou. Faça login novamente.', 'error');
        logout();
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            showPopup('Sua sessão expirou. Faça login novamente.', 'error');
            logout();
            return null;
        }

        return token; // Retorna o token válido
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        logout();
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se o token está presente e é válido antes de carregar os dados
    if (!checkTokenOnLoad()) return; // Se o token não for válido, a execução é interrompida

    const urlParams = new URLSearchParams(window.location.search);
    const chamadoId = urlParams.get('id');

    if (chamadoId) {
        try {
            const response = await fetch(`http://localhost:3000/filtros/${chamadoId}`);
            if (!response.ok) throw new Error('Erro ao carregar os dados do chamado');

            const chamado = await response.json();
            preencherFormulario(chamado);
            showPopup('Dados do chamado carregados com sucesso.', 'success'); // Exibe o popup após carregar os dados
        } catch (error) {
            console.error('Erro ao carregar dados do chamado:', error);
            showPopup('Erro ao carregar dados do chamado.', 'error'); // Exibe o popup de erro
        }
    }

    // Manipulador de evento para salvar as alterações
    const formEdicao = document.getElementById('form-edicao'); 
    formEdicao.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Verificar se o token é válido antes de tentar salvar as alterações
        if (!checkTokenBeforeRequest()) return; // Se o token não for válido, não envia a requisição

        const chamadoId = urlParams.get('id');
        const data = new FormData(formEdicao);
        const values = Object.fromEntries(data.entries());

        try {
            const response = await fetch(`http://localhost:3000/filtros/${chamadoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                showPopup('Chamado atualizado com sucesso.', 'success'); // Exibe o popup de sucesso
                document.getElementById('mensagem-envio').style.display = 'block';
                formEdicao.reset();
                setTimeout(() => {
                    window.location.href = '../paginaHistoricoAtualizada/histórico.html';
                }, 1000);
            } else {
                throw new Error('Erro ao atualizar chamado');
            }
        } catch (error) {
            console.error(error);
            showPopup('Erro ao atualizar o chamado.', 'error'); // Exibe o popup de erro
        }
    });
});

// Função para preencher o formulário com os dados do chamado
function preencherFormulario(chamado) {
    document.getElementById('tiposDoChamado').value = chamado.tiposDoChamado;
    document.getElementById('nivelDeUrgencia').value = chamado.nivelDeUrgencia;
    document.getElementById('email').value = chamado.email;
    document.getElementById('setor').value = chamado.setor;
    document.getElementById('nomeUsuario').value = chamado.nomeUsuario;
    document.getElementById('nomeEquipamento').value = chamado.nomeEquipamento;
    document.getElementById('datas').value = chamado.datas;
    document.getElementById('FK_tecnicoResponsavelPeloChamado').value = chamado.FK_tecnicoResponsavelPeloChamado;
    document.getElementById('descricao').value = chamado.descricao;
}

// Função para verificar a validade do token ao carregar a página
function checkTokenOnLoad() {
    const token = localStorage.getItem('token');

    // Se não houver token, redireciona para login
    if (!token) {
        showPopup('Você precisa estar logado para acessar esta página.', 'error');
        window.location.href = '../paginaLogin/login.html';
        logout();
        return false; // Retorna falso para interromper a execução do código
    }

    // Verifica se o token expirou
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            showPopup('Sua sessão expirou. Faça login novamente.', 'error');
            logout(); // Remove o token e redireciona para o login
            return false;
        }
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        logout();
        return false;
    }

    return true; // Retorna verdadeiro caso o token seja válido
}

// Função para verificar a validade do token antes de enviar a requisição
function checkTokenBeforeRequest() {
    const token = localStorage.getItem('token');

    // Se não houver token, exibe mensagem de erro e interrompe a requisição
    if (!token) {
        showPopup('Você precisa estar logado para salvar as alterações.', 'error');
        logout();
        setTimeout(() => {
            window.location.href = '../paginaLogin/login.html'; // Redireciona para login após mostrar o popup
        }, 1500); // Tempo suficiente para o popup aparecer
        return false;
    }

    // Verifica se o token expirou
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            showPopup('Sua sessão expirou. Faça login novamente.', 'error');
            setTimeout(() => {
                logout(); // Remove o token e redireciona para o login
            }, 1500); // Tempo suficiente para o popup aparecer
            return false;
        }
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        setTimeout(() => {
            logout(); // Remove o token e redireciona para o login
        }, 1500); // Tempo suficiente para o popup aparecer
        return false;
    }

    return true; // Retorna verdadeiro caso o token seja válido
}


window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};
