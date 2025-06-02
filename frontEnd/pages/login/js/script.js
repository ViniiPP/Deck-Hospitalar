// script.js
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember');
    const togglePasswordButton = document.getElementById('togglePassword');

    // Lidar com a submissão do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Pega os valores dos campos no momento da submissão
            const email = emailInput.value;
            const password = passwordInput.value;
            const rememberMe = rememberMeCheckbox.checked;

            // Validações básicas
            if (!email || !password) {
                alert('Por favor, preencha o e-mail e a senha.');
                return;
            }

            console.log('Tentativa de login com:');
            console.log('Email:', email);
            
            // apagar dps iss aqui de baixo:
            console.log('Senha:', password);
            console.log('Lembrar-me:', rememberMe);

            alert(`Login simulado!\nEmail: ${email}\nLembrar: ${rememberMe}`);
            // Aqui você adicionaria a lógica de autenticação real (ex: chamada de API)

            
            loginForm.reset();
        });
    }

    // Lidar com a visibilidade da senha
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Altera o ícone do olho
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
    } else {
        console.error("Botão de alternar senha ou campo de senha não encontrado.");
    }
});