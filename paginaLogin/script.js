// Função para alternar entre mostrar e esconder senha
function togglePassword(inputId, iconId) {
    const senhaInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    const tipoAtual = senhaInput.type;

    if (tipoAtual === 'password') {
        senhaInput.type = 'text';
        icon.src = '../assets/icons/eye-open.png';
        icon.alt = 'Esconder senha';
    } else {
        senhaInput.type = 'password';
        icon.src = '../assets/icons/eye-closed.png';
        icon.alt = 'Mostrar senha';
    }
}

// Adiciona o evento de click para mostrar/ocultar a senha
document.getElementById('toggle-senha').addEventListener('click', function() {
    togglePassword('senha', 'toggle-senha');
});

// Função de login que autentica o usuário e armazena o token JWT
async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });

        const result = await response.json();

        if (response.ok) {
            // Armazena o token JWT no localStorage
            localStorage.setItem('token', result.token);
            window.location.href = '../Home/home.html'; // Redireciona para a página inicial
        } else {
            alert(result.error || "Falha no login. Verifique suas credenciais.");
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert("Erro ao fazer login. Tente novamente mais tarde.");
    }
}

// Função para buscar dados de uma rota protegida usando o token JWT
async function fetchProtectedData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você precisa estar logado.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/protected-route', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Dados protegidos:', data);
        } else {
            alert('Erro ao acessar dados protegidos.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados protegidos:', error);
        alert("Erro ao buscar dados protegidos.");
    }
}
