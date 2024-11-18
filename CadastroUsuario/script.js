
// Função para alternar entre mostrar e esconder senha
function togglePassword(inputId, iconId) {
    const senhaInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    const tipoAtual = senhaInput.type;

    // Alterna entre 'password' e 'text'
    if (tipoAtual === 'password') {
        senhaInput.type = 'text'; // Mostra a senha
        icon.src = '../CadastroUsuario/img/eye-open.png'; // Altera para o ícone do olho aberto
        icon.alt = 'Esconder senha'; // Alterar o texto alternativo para acessibilidade
    } else {
        senhaInput.type = 'password'; // Esconde a senha
        icon.src = '../CadastroUsuario/img/eye-closed.png'; // Altera para o ícone do olho fechado
        icon.alt = 'Mostrar senha'; // Alterar o texto alternativo para acessibilidade
    }
}

// Adiciona o evento de click para mostrar/ocultar a senha
document.getElementById('toggle-senha').addEventListener('click', function() {
    togglePassword('senha', 'toggle-senha');
});

document.getElementById('toggle-confirma-senha').addEventListener('click', function() {
    togglePassword('confirma-senha', 'toggle-confirma-senha');
});


document.querySelector('.confirm-button').addEventListener('click', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do link

    // Captura os valores dos campos do formulário
    const nomeUsuario = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('confirma-senha').value;

    // Limpa mensagens de erro anteriores
    document.getElementById('nome-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('senha-error').textContent = '';
    document.getElementById('confirma-senha-error').textContent = '';
    document.getElementById('server-message').textContent = '';

    let hasError = false;

    // Regex para validar o nome
    const nomeRegex = /^[a-zA-ZÀ-ÿ]+(\s+[a-zA-ZÀ-ÿ]+)+$/;
    if (!nomeRegex.test(nomeUsuario)) {
        document.getElementById('nome-error').textContent = 'O nome deve conter pelo menos o nome e sobrenome e não pode conter números.';
        hasError = true;
    }

    // Regex para validar o e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Por favor, insira um e-mail válido.';
        hasError = true;
    }

    // Validação de senha
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^.&*()_+])[A-Za-z\d!@#$%^.&*()_+]{8,}$/;
    if (!senhaRegex.test(password)) {
        document.getElementById('senha-error').textContent = 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.';
        hasError = true;
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
        document.getElementById('confirma-senha-error').textContent = 'As senhas não coincidem.';
        hasError = true;
    }

    // Se houve algum erro, impede o envio do formulário
    if (hasError) return;

    try {
        // Faz a requisição POST para o endpoint do back-end
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, nomeUsuario, password }),
        });

        // Analisa a resposta do back-end
        const result = await response.json();

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            // Redireciona para a página de login após 2 segundos
            setTimeout(() => {
                window.location.href = '../paginaLogin/login.html';
            }, 2000);
        } else {
            // Tratamento de erros específicos retornados pelo back-end
            if (result.error.includes('E-mail')) {
                document.getElementById('email-error').textContent = result.error;
            } else if (result.error.includes('Usuário')) {
                document.getElementById('nome-error').textContent = result.error;
            } else {
                document.getElementById('server-message').textContent = result.error;
                document.getElementById('server-message').style.color = 'red';
            }
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        document.getElementById('server-message').textContent = 'Erro no servidor. Tente novamente mais tarde.';
        document.getElementById('server-message').style.color = 'red';
    }
});

// Opção para o botão "Cancelar"
document.querySelector('.cancel-button').addEventListener('click', (event) => {
    event.preventDefault(); // Previne comportamento padrão do link
    window.location.href = '../paginaLogin/login.html'; // Redireciona para a página de login
});