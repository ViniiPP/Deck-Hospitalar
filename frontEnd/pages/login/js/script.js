document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');

    // Lidar com a submissão do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = emailInput.value;
            const password = passwordInput.value;

            // Validações básicas
            if (!email || !password) {
                alert('Por favor, preencha o e-mail e a senha.');
                return;
            }

            // Preparar os dados para enviar ao backend
            const dadosParaEnviar = {
                email: email,
                senha: password, 
            };
            console.log('Tentando login com:', dadosParaEnviar);

            try {
                // A URL do seu backend, incluindo a porta 8086
                const response = await fetch("http://localhost:8086/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosParaEnviar)
                });

                // Verifica se a requisição foi bem-sucedida
                
                if (response.ok) {
                    const resultado = await response.text();
                    console.log('Login bem-sucedido:', resultado);

                    if (resultado) {
                        // Salva o token no sessionStorage. Ele será limpo quando o navegador fechar.
                        sessionStorage.setItem('authToken', resultado);
                        console.log('Token salvo na sessão.');

                        // Redireciona para o dashboard
                        window.location.href = '../dashboard/index.html';
                    } else {

                        alert("Login bem-sucedido, mas nenhum token foi recebido.");
                    }
                } else {
                    // Tratamento de erro simplificado
                    let erroMsg = "Falha no login. Verifique suas credenciais.";
                    try {
                        const errorData = await response.json();
                        if (errorData && errorData.message) {
                            erroMsg = errorData.message; // Usa a mensagem de erro específica do backend
                        }
                    } catch (e) {
                        // Mantém a mensagem de erro padrão se a resposta não for JSON
                    }
                    console.error('Erro do backend:', response.status, erroMsg);
                    alert(erroMsg); // Exibe a mensagem de erro ao usuário
                }
            } catch (error) {
                console.error('Erro de conexão ao enviar dados para o backend:', error);
                alert("Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.");
            }
        });
    } 

    // Lidar com a visibilidade da senha
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Seleciona o elemento iconify-icon dentro do botão clicado
            const iconElement = this.querySelector('iconify-icon');
            if (iconElement) {
                // Alterna o ícone com base no tipo do input
                iconElement.setAttribute('icon', type === 'password' ? 'mdi:eye-off' : 'mdi:eye');
            }
        }); 
    } else {
        console.error("Botão de alternar senha ou campo de senha não encontrado.");
    } 
});