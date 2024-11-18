document.addEventListener('DOMContentLoaded', async () => {
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
                alert('Chamado atualizado com sucesso!');
                window.location.href = '../paginaHistoricoAtualizada/histórico.html';
            } else {
                throw new Error('Erro ao atualizar chamado');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar o chamado.');
        }
    });
});

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