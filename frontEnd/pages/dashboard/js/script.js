document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const gridDispositivos = document.getElementById('dispositivosGrid');
    const templateDispositivo = document.getElementById('templateDispositivo');
    
    // Modal QR Code
    const adicionarDispositivoBtn = document.getElementById('adicionarDispositivoBtn');
    const modalQrCode = document.getElementById('modalQrCode');
    // ID CORRIGIDO AQUI para corresponder ao HTML
    const fecharModalQrBtn = document.getElementById('fecharModalBtn');

    // Modal Editar
    const modalEditar = document.getElementById('modalEditarDispositivo');
    const fecharModalEditarBtn = document.getElementById('fecharModalEditarBtn');
    const formEditarDispositivo = document.getElementById('formEditarDispositivo');
    const idDispositivoInput = document.getElementById('idDispositivoEditar');
    const novoNomeInput = document.getElementById('novoNomeDispositivo');

    // --- ESTADO DA APLICAÇÃO ---
    let dispositivos = [];
    let html5QrCode;
    let websocket;

    // --- FUNÇÕES ---

    /**
     * Recupera o token de autenticação salvo no localStorage ou sessionStorage.
     * @returns {string|null} O token ou null se não for encontrado.
     */
    function obterToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }

    /**
     * Adiciona um novo card de dispositivo à tela.
     */
    function adicionarCardDispositivo(dispositivo) {
        const card = templateDispositivo.content.firstElementChild.cloneNode(true);
        card.dataset.id = dispositivo.id;
        card.querySelector('.card-titulo').textContent = dispositivo.name;
        atualizarCard(card, { status: 'Online', temperatura: '--', umidade: '--', luminosidade: '--', ruido: '--', qualidadeAr: '--' });
        gridDispositivos.appendChild(card);
    }

    /**
     * Atualiza um card existente com novos dados do WebSocket.
     */
    function atualizarCard(card, dados) {
        const isOnline = dados.status === 'Online';
        card.querySelector('.status-texto').textContent = dados.status;
        card.classList.toggle('online', isOnline);
        card.classList.toggle('offline', !isOnline);
        
        card.querySelector('[data-sensor="temperatura"]').textContent = isOnline ? `${dados.temperatura || '--'} °C` : '-- °C';
        card.querySelector('[data-sensor="umidade"]').textContent = isOnline ? `${dados.umidade || '--'} %` : '-- %';
        card.querySelector('[data-sensor="luminosidade"]').textContent = isOnline ? `${dados.luminosidade || '--'} Lux` : '-- Lux';
        card.querySelector('[data-sensor="ruido"]').textContent = isOnline ? `${dados.ruido || '--'} dB` : '-- dB';
        card.querySelector('[data-sensor="qualidadeAr"]').textContent = isOnline ? `${dados.qualidadeAr || '--'}` : '--';
    }
    
    /**
     * Conecta ao servidor WebSocket para receber dados em tempo real.
     */
    function conectarWebSocket() {
        const wsUrl = 'ws://localhost:8086/ws';
        websocket = new WebSocket(wsUrl);

        websocket.onopen = () => console.log('Conexão WebSocket estabelecida com sucesso.');
        websocket.onmessage = (event) => {
            try {
                const dados = JSON.parse(event.data);
                console.log('Dados recebidos via WebSocket:', dados);
                const dispositivo = dispositivos.find(d => d.id === dados.id);
                const card = gridDispositivos.querySelector(`[data-id="${dados.id}"]`);
                if (dispositivo && card) {
                    dispositivo.status = dados.status || 'Online';
                    atualizarCard(card, dados);
                }
            } catch (error) {
                console.error('Erro ao processar mensagem do WebSocket:', error);
            }
        };
        websocket.onerror = (error) => console.error('Erro no WebSocket:', error);
        websocket.onclose = () => {
            console.log('Conexão WebSocket fechada. Tentando reconectar em 5 segundos...');
            setTimeout(conectarWebSocket, 5000);
        };
    }

    // --- Funções do Modal de QR Code ---
    const iniciarScanner = () => {
        const token = obterToken(); // Verifica o token antes de iniciar o scanner
        if (!token) {
            alert("Sessão expirada ou não autenticada. Por favor, faça login novamente.");
            window.location.href = '../login/index.html'; // Ajuste o caminho para a sua tela de login
            return;
        }
        modalQrCode.classList.add('visivel');
        html5QrCode = new Html5Qrcode("leitor-qr-code");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
            .catch(err => {
                console.error("Não foi possível iniciar o scanner de QR Code.", err);
                alert("Erro ao iniciar a câmera. Verifique as permissões.");
                fecharModalQr();
            });
    };
    
    const onScanSuccess = async (idDecodificado) => {
        fecharModalQr();
        
        const token = obterToken();
        if (!token) {
            alert("Sessão expirada ou não autenticada. Por favor, faça login novamente.");
            window.location.href = '../login/index.html';
            return;
        }

        if (dispositivos.some(d => d.id === idDecodificado)) {
            alert('Este dispositivo já foi adicionado.');
            return;
        }
        
        const dadosParaEnviar = { id: idDecodificado };
        
        try {
            const urlBackend = 'http://localhost:8086/ws/uuid'; 
            const response = await fetch(urlBackend, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosParaEnviar),
            });

            if (response.ok) {
                const mensagemSucesso = await response.text();
                console.log('Resposta do backend:', mensagemSucesso);
                
                const novoNome = `Dispositivo - ${idDecodificado.slice(-4)}`;
                const novoDispositivo = { id: idDecodificado, name: novoNome, status: 'Online' };
                dispositivos.push(novoDispositivo);
                
                adicionarCardDispositivo(novoDispositivo);
                alert(`Dispositivo "${novoNome}" adicionado com sucesso!`);
            } else {
                const mensagemErro = await response.text();
                alert(`Falha ao adicionar dispositivo: ${mensagemErro || 'Erro desconhecido.'}`);
            }
        } catch (error) {
            console.error('Erro de rede ao conectar com o backend:', error);
            alert('Não foi possível conectar ao servidor. Verifique o endereço e se o backend está rodando.');
        }
    };

    const fecharModalQr = () => {
        modalQrCode.classList.remove('visivel');
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(err => console.error("Erro ao parar o scanner.", err));
        }
    };

    // --- Funções do Modal de Edição ---
    const abrirModalEditar = (idDispositivo) => {
        const dispositivo = dispositivos.find(d => d.id === idDispositivo);
        if (dispositivo) {
            idDispositivoInput.value = dispositivo.id;
            novoNomeInput.value = dispositivo.name;
            modalEditar.classList.add('visivel');
        }
    };

    const fecharModalEditar = () => {
        modalEditar.classList.remove('visivel');
    };

    const salvarAlteracoesDispositivo = async (event) => {
        event.preventDefault();
        const id = idDispositivoInput.value;
        const novoNome = novoNomeInput.value.trim();
        
        // ++ CORREÇÃO: Pega o token aqui também ++
        const token = obterToken();
        if (!token) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = '../login/index.html';
            return;
        }

        if (novoNome) {
            try {
                const urlEditar = `http://localhost:8086/api/dispositivos/${id}/nome`;
                const response = await fetch(urlEditar, {
                    method: 'PUT', 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ nome: novoNome }),
                });

                if (response.ok) {
                    const dispositivo = dispositivos.find(d => d.id === id);
                    if (dispositivo) {
                        dispositivo.name = novoNome;
                        const card = gridDispositivos.querySelector(`[data-id="${id}"]`);
                        if(card) card.querySelector('.card-titulo').textContent = novoNome;
                    }
                    alert('Nome do dispositivo atualizado com sucesso!');
                    fecharModalEditar();
                } else {
                     const mensagemErro = await response.text();
                     alert(`Falha ao atualizar nome: ${mensagemErro}`);
                }
            } catch(error) {
                console.error("Erro ao salvar alteração do nome:", error);
                alert("Não foi possível salvar o novo nome. Verifique sua conexão.");
            }
        } else {
            alert('O nome do dispositivo não pode ficar em branco.');
        }
    };

    // --- EVENT LISTENERS ---
    adicionarDispositivoBtn.addEventListener('click', iniciarScanner);
    fecharModalQrBtn.addEventListener('click', fecharModalQr);
    modalQrCode.addEventListener('click', (event) => {
        if (event.target === modalQrCode) fecharModalQr();
    });

    gridDispositivos.addEventListener('click', (event) => {
        const botaoEditar = event.target.closest('.botao-editar');
        if (botaoEditar) {
            const card = botaoEditar.closest('.card-dispositivo');
            if (card) {
                abrirModalEditar(card.dataset.id);
            }
        }
    });

    formEditarDispositivo.addEventListener('submit', salvarAlteracoesDispositivo);
    fecharModalEditarBtn.addEventListener('click', fecharModalEditar);
    modalEditar.addEventListener('click', (event) => {
        if (event.target === modalEditar) fecharModalEditar();
    });

    // --- INICIALIZAÇÃO ---
    conectarWebSocket();
});