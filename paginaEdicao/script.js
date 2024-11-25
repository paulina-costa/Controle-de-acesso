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
        } catch (error) {
            console.error('Erro ao carregar dados do chamado:', error);
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
            alert('Erro ao atualizar o chamado.');
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
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../paginaLogin/login.html';
        return false; // Retorna falso para interromper a execução do código
    }

    // Verifica se o token expirou
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            alert('Sua sessão expirou. Faça login novamente.');
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

// Função de logout
function logout() {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Redireciona para a página de login
    window.location.href = '../paginaLogin/login.html';
}

// Função para verificar a validade do token antes de enviar a requisição
function checkTokenBeforeRequest() {
    const token = localStorage.getItem('token');

    // Se não houver token, exibe mensagem de erro e interrompe a requisição
    if (!token) {
        alert('Você precisa estar logado para salvar as alterações.');
        window.location.href = '../paginaLogin/login.html'; // Redireciona para login
        return false;
    }

    // Verifica se o token expirou
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            alert('Sua sessão expirou. Faça login novamente.');
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

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};
