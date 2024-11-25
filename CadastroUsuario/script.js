// Alterna entre mostrar e esconder senha
function togglePassword(inputId, iconId) {
    const senhaInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        icon.src = '../assets/icons/eye-open.png';
    } else {
        senhaInput.type = 'password';
        icon.src = '../assets/icons/eye-closed.png';
    }
}

// Adiciona eventos aos botões de exibir/esconder senha
document.getElementById('toggle-senha').addEventListener('click', () => togglePassword('senha', 'toggle-senha'));
document.getElementById('toggle-confirma-senha').addEventListener('click', () => togglePassword('confirma-senha', 'toggle-confirma-senha'));

// Função para validar campo no backend
async function validarCampo(fieldName, value, errorElementId) {
    try {
        const response = await fetch('http://localhost:3000/validarCampo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fieldName, value }),
        });

        const result = await response.json();

        if (!response.ok) {
            document.getElementById(errorElementId).textContent = result.error;
            return false;
        } else {
            document.getElementById(errorElementId).textContent = '';
            return true;
        }
    } catch (error) {
        console.error(`Erro ao validar campo ${fieldName}:`, error);
        document.getElementById(errorElementId).textContent = 'Erro ao validar o campo.';
        return false;
    }
}

// Validação individual ao sair do campo
document.getElementById('nome').addEventListener('blur', () => validarCampo('nomeUsuario', document.getElementById('nome').value, 'nome-error'));
document.getElementById('email').addEventListener('blur', () => validarCampo('email', document.getElementById('email').value, 'email-error'));
document.getElementById('senha').addEventListener('blur', () => validarCampo('password', document.getElementById('senha').value, 'senha-error'));

// Confirmação da senha
document.getElementById('confirma-senha').addEventListener('blur', () => {
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;

    if (senha !== confirmaSenha) {
        document.getElementById('confirma-senha-error').textContent = 'As senhas não coincidem.';
    } else {
        document.getElementById('confirma-senha-error').textContent = '';
    }
});

// Função para enviar o formulário
document.querySelector('.confirm-button').addEventListener('click', async (event) => {
    event.preventDefault();

    // Captura valores dos campos
    const nomeUsuario = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;

    let isValid = true;

    // Valida os campos
    isValid &= await validarCampo('nomeUsuario', nomeUsuario, 'nome-error');
    isValid &= await validarCampo('email', email, 'email-error');
    isValid &= await validarCampo('password', senha, 'senha-error');

    if (senha !== confirmaSenha) {
        document.getElementById('confirma-senha-error').textContent = 'As senhas não coincidem.';
        isValid = false;
    }

    if (!isValid) return;

    // Faz o cadastro se todos os campos forem válidos
    try {
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nomeUsuario, email, password: senha }),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('server-message').textContent = 'Usuário criado com sucesso!';
            document.getElementById('server-message').style.color = 'green';

            setTimeout(() => {
                window.location.href = '../paginaLogin/login.html';
            }, 2000);
        } else {
            document.getElementById('server-message').textContent = result.error;
            document.getElementById('server-message').style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        document.getElementById('server-message').textContent = 'Erro no servidor. Tente novamente mais tarde.';
        document.getElementById('server-message').style.color = 'red';
    }
});

// Botão de cancelar
document.querySelector('.cancel-button').addEventListener('click', () => {
    window.location.href = '../paginaLogin/login.html';
});
