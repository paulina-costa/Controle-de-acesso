async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
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
            localStorage.setItem('token', result.token);
            window.location.href = '../Home/home.html';
        } else {
            alert(result.error || 'Erro ao fazer login.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao conectar ao servidor.');
    }
}

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};
