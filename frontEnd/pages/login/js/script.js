// script.js
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember');
    const togglePasswordButton = document.getElementById('togglePassword');

    // Lidar com a submissão do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
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

            // Preparar os dados para enviar ao backend
            const dadosParaEnviar = {
                email: email,
                password: password, 
                rememberMe: rememberMe // Enviar o estado do checkbox "Lembrar-me" true ou false
            };
            console.log('Tentando login com:', dadosParaEnviar);

            try {
                const response = await fetch('http://localhost:8086/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosParaEnviar)
                });

                // Verifica se a requisição foi bem-sucedida
                if (response.ok) {
                    const resultado = await response.json();
                    console.log('Login bem-sucedido:', resultado);

                    // lidando com token de autenticação
                    if (resultado.token) {
                        // Salvar o token (localStorage é persistente, sessionStorage dura até fechar a aba)
                        if (rememberMe) {
                            // Armazenar o token no localStorage se "Lembrar-me" estiver marcado
                            localStorage.setItem('authToken', resultado.token);
                        } else {
                            sessionStorage.setItem('authToken', resultado.token);
                        }
                        console.log('Token salvo:', resultado.token);
                    }

                    window.location.href = '../dashboard/index.html'; // Redireciona para a página de dashboard após o login (A FAZER)
                    loginForm.reset();
                } else {
                    // se o backend retornar um erro
                    let erroMsg = "Falha no login. Verifique suas credenciais.";
                    try {
                        const errorData = await response.json();
                        if (errorData && errorData.message) {
                            erroMsg = errorData.message; // Mensagem de erro do backend
                        } else if (response.statusText) {
                            erroMsg = response.statusText; // Mensagem de erro genérica
                        }
                    } catch (e) {
                        // Se a resposta de erro não for JSON, usa o statusText ou a mensagem padrão
                        if (response.statusText) erroMsg = response.statusText;
                    }
                    console.error('Erro do backend:', response.status, erroMsg);
                    alert(erroMsg); // Exibe a mensagem de erro ao usuário
                }
            } catch (error) {
                console.error('Erro fetch ao enviar dados para o backend:', error);
                alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            }
            
        });
    } 

    // Lidar com a visibilidade da senha
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const iconElement = this.querySelector('iconify-icon');
            if (iconElement) {
                iconElement.setAttribute('icon', type === 'password' ? 'mdi:eye-off' : 'mdi:eye');
            }
        }); 
    } else {
        console.error("Botão de alternar senha ou campo de senha não encontrado.");
    } 
});