async function filtrarChamados() {
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

function abrirModalExclusao(id) {
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
            alert('Chamado excluído com sucesso!');
        } else {
            throw new Error('Erro ao excluir chamado');
        }
    } catch (error) {
        console.error('Erro ao excluir chamado:', error);
        alert('Erro ao excluir chamado. Tente novamente mais tarde.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    filtrarChamados();
});
