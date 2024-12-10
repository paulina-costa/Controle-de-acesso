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
    showPopup('Você foi desconectado.', 'success');  // Exibe popup de sucesso
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
        showPopup('Sua sessão expirou. Faça login novamente.', 'error');  // Exibe popup de erro
        logout();
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (payload.exp < now) {
            showPopup('Sua sessão expirou. Faça login novamente.', 'error');  // Exibe popup de erro
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


async function filtrarChamados() {
    const token = verificarToken(); // Verifica a validade do token antes de enviar
        if (!token) return; // Se o token for inválido, não faz a requisição
    const formData = new FormData(document.getElementById('filterForm'));
    const filterData = {};

    formData.forEach((value, key) => {
        filterData[key] = value;
    });

    try {
        const response = await fetch('http://localhost:3000/filtros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar os dados filtrados');
        }

        const data = await response.json();
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        if (data.data.length > 0) {
            data.data.forEach(item => {
                const row = 
                `<tr id="chamado-${item.id}">
                    <td>${item.tiposDoChamado}</td>
                    <td>${item.nivelDeUrgencia}</td>
                    <td>${item.setor}</td>
                    <td>${item.nomeEquipamento}</td>
                    <td>${new Date(item.datas).toLocaleDateString()}</td>
                    <td>${item.resolucao}</td>
                    <td>
                        <a href="../paginaEdicao/edicao.html?id=${item.id}">
                        <img src="src/img/pencil.png" alt="Editar" class="icon" width="18.4" height="18.4">
                        </a>
                        <img src="src/img/trash-can.png" alt="Excluir" class="icon" width="18.4" height="18.4" onclick="abrirModalExclusao(${item.id})">
                    </td>
                </tr>`;

                tableBody.insertAdjacentHTML('beforeend', row);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="7">Nenhum resultado encontrado</td></tr>`;
        }

    } catch (error) {
        console.error('Erro ao filtrar chamados:', error);
    }
}

// Modificação para garantir que a tabela é recarregada corretamente após limpar os filtros
async function carregarChamados() {
    const token = verificarToken(); // Verifica a validade do token antes de enviar
    if (!token) return; // Se o token for inválido, não faz a requisição

    try {
        // Fazendo a requisição para o backend para buscar todos os chamados
        const response = await fetch('http://localhost:3000/chamados');  // Substitua pela URL correta do seu backend
        if (!response.ok) throw new Error('Erro ao carregar os chamados.');

        const chamados = await response.json();  // Recebe os dados no formato JSON

        // Limpa a tabela antes de preenchê-la
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';  // Limpa a tabela

        if (chamados.length > 0) {
            chamados.forEach(chamado => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${chamado.tipoChamado}</td>
                    <td>${chamado.nivelUrgencia}</td>
                    <td>${chamado.setor}</td>
                    <td>${chamado.equipamento}</td>
                    <td>${new Date(chamado.data).toLocaleDateString()}</td>
                    <td>${chamado.resolucao}</td>
                    <td>
                        <a href="edicao.html?id=${chamado.id}" class="btn-editar">Editar</a>
                        <button class="btn-excluir" onclick="confirmarExclusao(${chamado.id})">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="7">Nenhum chamado encontrado</td></tr>`;
        }
    } catch (error) {
        console.error('Erro ao carregar os chamados:', error);
    }
}

// Chamado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarChamados();
});


// Função para atualizar a tabela com os dados dos chamados
function atualizarTabela(chamados) {
    const token = verificarToken(); // Verifica a validade do token antes de enviar
        if (!token) return; // Se o token for inválido, não faz a requisição
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpa a tabela antes de atualizar

    if (chamados.length > 0) {
        chamados.forEach(item => {
            const row = 
            `<tr id="chamado-${item.id}">
                <td>${item.tiposDoChamado}</td>
                <td>${item.nivelDeUrgencia}</td>
                <td>${item.setor}</td>
                <td>${item.nomeEquipamento}</td>
                <td>${new Date(item.datas).toLocaleDateString()}</td>
                <td>${item.resolucao}</td>
                <td>
                    <a href="../paginaEdicao/edicao.html?id=${item.id}">
                        <img src="img/pencil2.png" alt="Editar" class="icon" width="18.4" height="18.4">
                    </a>
                    <img src="img/trash-can.png" alt="Excluir" class="icon" width="18.4" height="18.4" onclick="abrirModalExclusao(${item.id})">
                </td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    } else {
        tableBody.innerHTML = `<tr><td colspan="7">Nenhum resultado encontrado</td></tr>`;
    }
}

function abrirModalExclusao(id) {
    const token = verificarToken(); // Verifica a validade do token antes de enviar
        if (!token) return; // Se o token for inválido, não faz a requisição
    const modal = document.getElementById('confirmModal');
    const confirmButton = document.getElementById('confirmDeleteBtn');
    const cancelButton = document.getElementById('cancelDeleteBtn');
    const closeButton = document.querySelector('.close-btn');
    
    modal.style.display = 'block';

    // Define a ação para o botão de confirmação
    confirmButton.onclick = async function() {
        modal.style.display = 'none'; // Fecha o modal após a confirmação
        await excluirChamado(id);
    };

    // Ação para cancelar e fechar o modal
    cancelButton.onclick = closeModal;
    closeButton.onclick = closeModal;

    // Fechar o modal se clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    function closeModal() {
        modal.style.display = 'none';
    }
}

async function excluirChamado(id) {
    const token = verificarToken(); // Verifica a validade do token antes de enviar
        if (!token) return; // Se o token for inválido, não faz a requisição
    try {
        const response = await fetch(`http://localhost:3000/filtros/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Se a exclusão for bem-sucedida, removemos a linha da tabela
            const row = document.getElementById(`chamado-${id}`);
            row.remove();
            showPopup('Chamado excluído com sucesso', 'success');
        } else {
            throw new Error('Erro ao excluir chamado');
        }
    } catch (error) {
        console.error('Erro ao excluir chamado:', error);
        showPopup('Erro ao excluir chamado', 'error');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    filtrarChamados();
});

// Previne o comportamento de envio do formulário (atualização da página)
document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne que a página seja atualizada
    filtrarChamados(); // Chama a função para aplicar os filtros
});

function limparFiltros() {
    // Limpa os filtros do formulário
    const selects = document.querySelectorAll('#filterForm select');
    selects.forEach(select => select.selectedIndex = 0);  

    // Limpa a tabela
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    // Chama a função que carrega todos os chamados
    carregarChamados();
}

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

