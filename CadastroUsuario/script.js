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
    showPopup('Você foi desconectado.', 'success');
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
            showPopup('Usuário criado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = '../paginaLogin/login.html';
            }, 2000);
        } else {
            showPopup(result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        showPopup('Erro no servidor. Tente novamente mais tarde.', 'error');
    }
});

// Botão de cancelar
document.querySelector('.cancel-button').addEventListener('click', () => {
    window.location.href = '../paginaLogin/login.html';
});
