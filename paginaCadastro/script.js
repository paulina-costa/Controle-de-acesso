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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const descricao = document.getElementById('descricao');

    verificarToken();


    // Função para enviar os dados do formulário
    const enviarDados = async (dadosFormulario) => {
        const token = verificarToken(); // Verifica a validade do token
        if (!token) {
            // Se o token não for válido, exibe uma mensagem e não realiza o envio
            showPopup('Sessão inválida ou expirada. Faça login novamente.', 'error');
            logout();
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/chamados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Envia o token no cabeçalho (opcional, dependendo da API)
                },
                body: JSON.stringify(dadosFormulario),
            });
    
            const resultado = await response.json();
            const mensagemEnvio = document.getElementById('mensagem-envio');
    
            if (response.ok) {
                mensagemEnvio.textContent = 'Cadastro enviado com sucesso!';
                mensagemEnvio.style.display = 'block';
    
                setTimeout(() => {
                    window.location.href = '../Home/home.html'; // Caminho para a página inicial
                }, 2000);
    
                form.reset(); // Limpa o formulário
            } else {
                mensagemEnvio.textContent = `Erro: ${resultado.erro || 'Erro desconhecido'}`;
                mensagemEnvio.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
    
            // Se o token for removido durante o envio, exibe mensagem de erro e faz logout
            if (!localStorage.getItem('token')) {
                showPopup('Sessão inválida ou expirada durante o envio. Faça login novamente.', 'error');
                logout();
                return;
            }
    
            const mensagemEnvio = document.getElementById('mensagem-envio');
            mensagemEnvio.textContent = 'Erro na conexão com o servidor.';
            mensagemEnvio.style.display = 'block';
        }
    };
    
    
    // Função para buscar e exibir o histórico de chamados
    const buscarHistorico = async () => {
        try {
            const response = await fetch('http://localhost:3000/filtros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();
            const tableBody = document.getElementById('tableBody');

            tableBody.innerHTML = ''; // Limpa a tabela

            data.data.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.tiposDoChamado}</td>
                        <td>${item.nivelDeUrgencia}</td>
                        <td>${item.setor}</td>
                        <td>${item.nomeEquipamento}</td>
                        <td>${item.FK_tecnicoResponsavelPeloChamado}</td>
                        <td>${new Date(item.datas).toLocaleDateString()}</td>
                        <td>${item.resolucao}</td>
                    </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        }
    };

    buscarHistorico(); // Busca o histórico ao carregar a página

    // Manipulação do envio do formulário
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const dadosFormulario = {
            nomeUsuario: document.getElementById('usuario').value,
            datas: document.getElementById('data').value,
            setor: document.getElementById('setor').value,
            tiposDoChamado: document.getElementById('tipo-chamado').value,
            nivelDeUrgencia: document.getElementById('nivel-urgencia').value,
            nomeEquipamento: document.getElementById('equipamento').value,
            FK_tecnicoResponsavelPeloChamado: parseInt(document.getElementById('responsavel').value, 10),
            email: document.getElementById('email').value,
            descricao: document.getElementById('descricao').value,
        };

        enviarDados(dadosFormulario);
    });

    // Atualiza a contagem de caracteres na textarea de descrição
    descricao.addEventListener('input', () => {
        const charCount = document.getElementById('char-count');
        charCount.textContent = `${descricao.value.length}/300`;
    });
});

// Script para evitar cache de navegação
window.onpageshow = function (event) {
    if (event.persisted) {
        window.location.reload();
    }
};
