// ./js/script.js
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('RegisterFrom');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password'); 
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const changePasswordBtn = document.getElementById('togglePassword');
    const changeConfirmPasswordBtn = document.getElementById('toggleconfirmPassword'); 


    // Lidar com a visibilidade da senha
    function configurarAlternarSenha(passwordInput, togglePasswordButton) {
        if (togglePasswordButton && passwordInput) {
            togglePasswordButton.addEventListener('click', function () {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Altera o ícone do olho no botão que foi clicado
                this.textContent = type === 'password' ? '👁️' : '🙈';
            });
        } else {
            console.error("Botão de alternar senha ou campo de senha não encontrado.");
        }
    }
    configurarAlternarSenha(passwordInput, changePasswordBtn);
    configurarAlternarSenha(confirmPasswordInput, changeConfirmPasswordBtn);

    // Lidar com a submissão do formulário
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
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

            // Preparar os dados para enviar ao backend
            const dadosParaEnviar = {
                email: email,
                senha: senha    // fazer um hash desta senha (ROBERTO)
            };
            console.log('Enviand dados para o backend:', dadosParaEnviar);

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosParaEnviar)
                });

                // Verifica se a requisição foi bem-sucedida
                if (response.ok) {
                    const resultado = await response.json();
                    console.log('Cadastro realizado com sucesso:', resultado);
                    formularioCadastro.reset(); // Limpa o formulário
                } else {
                    const errorData = await response.json().catch(() => null);
                    console.error('Erro ao cadastrar:', response.status, response.statusText, errorData);
                }
            } catch (error) {
                // Captura de erros de rede ou outros problemas com a requisição fetch
                console.error('Erro fetch ao enviar dados para o backend:', error);
                alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            }

            
            window.location.href = '../login/index.html'; // Redireciona para a página de login após o cadastro
        });
    } else {
        console.error("Formulário de cadastro com ID 'RegisterForm' não encontrado.");
    }
});