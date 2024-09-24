document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Seleciona o formulário
    const descricao = document.getElementById('descricao'); // Seleciona a descrição do problema

    // Função para enviar os dados do formulário
    const enviarDados = async (dadosFormulario) => {
        try {
            const response = await fetch('http://localhost:3000/chamados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosFormulario),
            });

            const resultado = await response.json();
            if (response.ok) {
                alert('Cadastro enviado com sucesso!');
                form.reset(); // Limpa o formulário após envio
            } else {
                alert('Erro ao enviar cadastro: ' + resultado.erro + '\nDetalhes: ' + (resultado.detalhes || 'Nenhum detalhe fornecido'));
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro na conexão com o servidor');
        }
    };

    // Manipulação do envio do formulário
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o comportamento padrão de recarregar a página

        // Pega os valores dos campos
        const dadosFormulario = {
            nomeUsuario: document.getElementById('usuario').value,
            datas: document.getElementById('data').value,
            setor: document.getElementById('setor').value,
            tiposDoChamado: document.getElementById('tipo-chamado').value,
            nivelDeUrgencia: document.getElementById('nivel-urgencia').value,
            nomeEquipamento: document.getElementById('equipamento').value,
            FK_tecnicoResponsavelPeloChamado: parseInt(document.getElementById('responsavel').value, 10), // Converte o valor para número
            email: document.getElementById('email').value,
            descricao: document.getElementById('descricao').value,
        };

        // Chama a função para enviar os dados ao servidor
        enviarDados(dadosFormulario);
    });

    // Atualiza a contagem de caracteres na textarea de descrição
    descricao.addEventListener('input', () => {
        const charCount = document.getElementById('char-count');
        charCount.textContent = `${descricao.value.length}/300`;
    });
});
