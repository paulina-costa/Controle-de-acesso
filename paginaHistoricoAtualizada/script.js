// Função única para verificar o token
async function verificarToken() {
    const token = localStorage.setItem('authToken', token);
    if (!token) {
        alert("Sessão expirada. Você será redirecionado para a página de login.");
        window.location.href = "../paginaLogin/login.html"; // Redireciona para a página de login
        return false;
    }

    try {
        const response = await fetch('/validar-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            alert('Token inválido ou expirado');
            window.location.href = "../paginaLogin/login.html"; // Redireciona para a página de login
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        alert('Ocorreu um erro ao verificar sua sessão.');
        window.location.href = "../paginaLogin/login.html"; // Redireciona para a página de login
        return false;
    }
}

// Função para verificar o token ao carregar a página
async function checkTokenOnLoad() {
    const tokenValido = await verificarToken();
    if (!tokenValido) return; // Se o token não for válido, não carrega a página
}

// Função para filtrar chamados
async function filtrarChamados() {
    const tokenValido = await verificarToken();
    if (!tokenValido) return; // Se o token não for válido, não prossegue com a filtragem

    const formData = new FormData(document.getElementById('filterForm'));
    const filterData = {};
    formData.forEach((value, key) => {
        filterData[key] = value;
    });

    try {
        const response = await fetch('/filtros', { // URL relativa
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

// Função para limpar filtros
async function limparFiltros() {
    const tokenValido = await verificarToken();
    if (!tokenValido) return; // Se o token não for válido, não prossegue com a limpeza dos filtros

    const selects = document.querySelectorAll('#filterForm select');
    selects.forEach(select => select.selectedIndex = 0);  // Limpa os filtros do formulário

    // Limpa a tabela
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    // Chama a função que carrega todos os chamados
    carregarChamados();
}

// Função para excluir um chamado
async function excluirChamado(id) {
    const tokenValido = await verificarToken();
    if (!tokenValido) return; // Se o token não for válido, não prossegue com a exclusão

    try {
        const response = await fetch(`/filtros/${id}`, { // URL relativa
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Se a exclusão for bem-sucedida, removemos a linha da tabela
            const row = document.getElementById(`chamado-${id}`);
            row.remove();
            alert('Chamado excluído com sucesso!');
        } else {
            throw new Error('Erro ao excluir chamado');
        }
    } catch (error) {
        console.error('Erro ao excluir chamado:', error);
        alert('Erro ao excluir chamado. Tente novamente mais tarde.');
    }
}

// Função para abrir o modal de exclusão
function abrirModalExclusao(id) {
    // Lógica para abrir o modal de exclusão
    const modal = document.getElementById('modalExclusao');
    modal.style.display = 'block';

    const confirmarButton = document.getElementById('confirmarExclusao');
    confirmarButton.onclick = () => excluirChamado(id);
}

document.addEventListener('DOMContentLoaded', checkTokenOnLoad); // Verifica o token ao carregar a página
