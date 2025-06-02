// ./js/script.js
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('RegisterFrom');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password'); 
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const changePasswordBtn = document.getElementById('togglePassword');
    const changeConfirmPasswordBtn = document.getElementById('toggleconfirmPassword'); 


    function configurarAlternarSenha(passwordInput, togglePasswordButton) {
        if (togglePasswordButton && passwordInput) {
            togglePasswordButton.addEventListener('click', function () {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Altera o ícone do olho no botão que foi clicado
                this.textContent = tipo === 'password' ? '👁️' : '🙈';
            });
        } else {
            console.error("Botão de alternar senha ou campo de senha não encontrado.");
        }
    }

    // Configura o toggle para o campo "Digite sua senha"
    configurarAlternarSenha(passwordInput, changePasswordBtn);

    // Configura o toggle para o campo "Confirme sua senha"
    configurarAlternarSenha(confirmPasswordInput, changeConfirmPasswordBtn);

    // Adiciona o listener para o evento de submit do formulário
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário
            
            // Pega os valores dos campos no momento da submissão
            const email = emailInput.value;
            const senha = passwordInput.value;
            const confirmarSenha = confirmPasswordInput.value;

            // Validações básicas
            if (!email || !senha || !confirmarSenha) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (senha.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            console.log('Dados do Cadastro:');
            console.log('Email:', email);

            alert(`Cadastro simulado realizado com sucesso para o e-mail: ${email}\n(Simulação)`);
            registerForm.reset();

            
            window.location.href = '../login/index.html'; // Redireciona para a página de login após o cadastro
        });
    } else {
        console.error("Formulário de cadastro com ID 'RegisterFrom' não encontrado.");
    }
});