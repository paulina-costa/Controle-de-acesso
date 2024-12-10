// Alterna a exibição da senha entre texto e oculto
function togglePassword(inputId, iconId) {
    const senhaInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        icon.src = 'img/eye-open.png';
        icon.alt = 'Esconder senha';
    } else {
        senhaInput.type = 'password';
        icon.src = 'img/eye-closed.png';
        icon.alt = 'Mostrar senha';
    }
}

// Exibe mensagens de popup para o usuário
function showPopup(message, isError = true) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');

    popup.className = isError ? 'popup-error show' : 'popup-success show';
    popupMessage.textContent = message;

    setTimeout(() => {
        popup.className = popup.className.replace('show', '').trim();
    }, 2500);
}

// Valida o formato do e-mail
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Valida se a senha foi preenchida
function validarSenha(senha) {
    return senha && senha.trim() !== '';
}

// Realiza o login do usuário
async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Limpa mensagens de erro
    document.getElementById('email-error').textContent = '';
    document.getElementById('senha-error').textContent = '';

    // Validações no cliente
    let isValid = true;

    if (!validarEmail(email)) {
        document.getElementById('email-error').textContent = 'E-mail inválido.';
        isValid = false;
    }

    if (!validarSenha(senha)) {
        document.getElementById('senha-error').textContent = 'Senha é obrigatória.';
        isValid = false;
    }

    if (!isValid) return;

    // Envio de requisição ao servidor
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const result = await response.json();

        if (response.ok) {
            // Armazena informações no localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('email', result.email);
            localStorage.setItem('nomeUsuario', result.nomeUsuario);

            showPopup('Login bem-sucedido!', false);

            // Redireciona após o popup desaparecer
            setTimeout(() => {
                window.location.href = '../Home/home.html';
            }, 2500);
        } else {
            // Exibe mensagem de erro do servidor
            showPopup(result.error || 'Falha no login. Verifique suas credenciais.', true);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showPopup('Erro ao fazer login. Tente novamente mais tarde.', true);
    }
}

// Adiciona eventos de validação ao sair dos campos
document.getElementById('email').addEventListener('blur', () => {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('email-error');

    if (!validarEmail(email)) {
        emailError.textContent = 'E-mail inválido.';
    } else {
        emailError.textContent = '';
    }
});

document.getElementById('senha').addEventListener('blur', () => {
    const senha = document.getElementById('senha').value;
    const senhaError = document.getElementById('senha-error');

    if (!validarSenha(senha)) {
        senhaError.textContent = 'Senha é obrigatória.';
    } else {
        senhaError.textContent = '';
    }
});