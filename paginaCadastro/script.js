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
            const mensagemEnvio = document.getElementById('mensagem-envio'); // Seleciona a mensagem de envio
    
            if (response.ok) {
                mensagemEnvio.textContent = 'Cadastro enviado com sucesso!'; // Atualiza o texto da mensagem
                mensagemEnvio.style.display = 'block'; // Torna a mensagem visível
    
                // Redireciona para a página inicial após 2 segundos
                setTimeout(() => {
                    window.location.href = '../Home/home.html'; // Caminho para a página inicial
                }, 2000);
    
                form.reset(); // Limpa o formulário após envio
            } else {
                mensagemEnvio.textContent = 'Erro ao enviar cadastro: ' + resultado.erro + '\nDetalhes: ' + (resultado.detalhes || 'Nenhum detalhe fornecido');
                mensagemEnvio.style.display = 'block'; // Torna a mensagem visível
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            const mensagemEnvio = document.getElementById('mensagem-envio');
            mensagemEnvio.textContent = 'Erro na conexão com o servidor';
            mensagemEnvio.style.display = 'block'; // Torna a mensagem visível
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
                body: JSON.stringify({}) // Envia um filtro vazio para buscar todos os registros
            });

            const data = await response.json();
            const tableBody = document.getElementById('tableBody');

            // Limpa a tabela antes de preencher
            tableBody.innerHTML = '';

            // Preencher a tabela com os resultados
            data.data.forEach(item => {
                const row = `<tr>
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

    // Executa a função para buscar o histórico ao carregar a página
    buscarHistorico();

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

// Script para contar os caracteres na textarea
const descricao = document.getElementById('descricao');
const charCount = document.getElementById('char-count');

descricao.addEventListener('input', () => {
    charCount.textContent = `${descricao.value.length}/300`;
});