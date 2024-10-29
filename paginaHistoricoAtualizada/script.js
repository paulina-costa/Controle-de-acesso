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
            `<tr>
                <td>${item.tiposDoChamado}</td>
                <td>${item.nivelDeUrgencia}</td>
                <td>${item.setor}</td>
                <td>${item.nomeEquipamento}</td>
                <td>${new Date(item.datas).toLocaleDateString()}</td>
                <td>${item.resolucao}</td>
                <td>
                    <img src="src/img/pencil.png" alt="Editar" class="icon" width="20" height="20" onclick="editarChamado(${item.id})">
                    <img src="src/img/trash-can.png" alt="Excluir" class="icon" width="20" height="20" onclick="excluirChamado(${item.id})">
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

function editarChamado(id) {
    // Função para editar chamado com base no ID
    console.log('Editar chamado ID:', id);
}

function excluirChamado(id) {
    // Função para excluir chamado com base no ID
    console.log('Excluir chamado ID:', id);
}

document.addEventListener('DOMContentLoaded', () => {
    filtrarChamados();
});