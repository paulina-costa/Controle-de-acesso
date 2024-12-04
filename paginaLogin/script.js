function showPopup(message, isError = true, callback = null) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');

    // Limpa as classes anteriores
    popup.classList.remove('popup-success', 'popup-error');

    // Define a cor de fundo dependendo do tipo de mensagem
    if (isError) {
        popup.classList.add('popup-error'); // Vermelho para erro
    } else {
        popup.classList.add('popup-success'); // Verde para sucesso
    }

    // Define a mensagem do popup
    popupMessage.textContent = message;

    // Exibe o popup com transição
    popup.classList.add('show');

    // Fecha automaticamente após 5 segundos e chama o callback
    setTimeout(() => {
        popup.classList.remove('show');
        if (callback) {
            callback(); // Chama a função de callback após o popup desaparecer
        }
    }, 2500);
}


// Função de login com popup personalizado
async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        showPopup("Por favor, preencha todos os campos.", true);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const result = await response.json();

        if (response.ok) {
            const { token, email, nomeUsuario } = result;
            if (token && email && nomeUsuario) {
                localStorage.setItem('token', token);
                localStorage.setItem('email', email);
                localStorage.setItem('nomeUsuario', nomeUsuario);
                showPopup("ㅤㅤㅤㅤLogin bem-sucedido!", false, () => {
                    window.location.href = '../Home/home.html'; // Redireciona após o popup desaparecer
                });
            } else {
                showPopup("Erro: Dados incompletos recebidos.", true);
            }
        } else {
            showPopup(result.error || "Falha no login. Verifique suas credenciais.", true);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showPopup("Erro ao fazer login. Tente novamente mais tarde.", true);
    }
}
