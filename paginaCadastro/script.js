function showPopup(message, type = 'success') {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    
    popupMessage.textContent = message;
    popup.className = `popup show ${type}`;

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        showPopup('Você precisa estar logado para acessar esta página.', 'error');
        setTimeout(() => {
            window.location.href = '../paginaLogin/login.html';
        }, 1500);
        return;
    }

    // Interceptar cliques em links para mostrar o popup
    const links = document.querySelectorAll('a.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            showPopup('Navegando para outra página...', 'success');
            setTimeout(() => {
                window.location.href = href;
            }, 1500); // Redireciona após 1,5s
        });
    });

    // Manipulação do formulário
    const form = document.getElementById('cadastroForm');
    form.addEventListener('submit', (event) => {
        if (!token) {
            showPopup('Você precisa estar logado para acessar esta página.', 'error');
            setTimeout(() => {
                window.location.href = '../paginaLogin/login.html';
            }, 1500);
            return;
        }
        event.preventDefault();

        fetch('/api/chamados', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Inclui o token na requisição
            },
            body: JSON.stringify(Object.fromEntries(new FormData(form)))
        })
        .then(response => {
            if (response.ok) {
                showPopup('Chamado cadastrado com sucesso!', 'success');
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                showPopup('Sessão expirada. Faça login novamente.', 'error');
                setTimeout(() => {
                    window.location.href = '../paginaLogin/login.html';
                }, 1500);
            } else {
                showPopup('Erro ao cadastrar o chamado.', 'error');
                setTimeout(() => {
                    window.location.href = '../paginaLogin/login.html';
                }, 1500);
            }
        })
        .catch(() => showPopup('Erro ao conectar ao servidor.', 'error'));
    });
});

// Script para contar os caracteres na textarea
const descricao = document.getElementById('descricao');
const charCount = document.getElementById('char-count');

descricao.addEventListener('input', () => {
    charCount.textContent = `${descricao.value.length}/300`;
});

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};
