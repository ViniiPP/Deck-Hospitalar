document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const gridDispositivos = document.getElementById('dispositivosGrid');
    const templateDispositivo = document.getElementById('templateDispositivo');

    const adicionarDispositivoBtn = document.getElementById('adicionarDispositivoBtn');
    const modalQrCode = document.getElementById('modalQrCode');
    const fecharModalQrBtn = document.getElementById('fecharModalQrBtn');

    const modalEditar = document.getElementById('modalEditarDispositivo');
    const fecharModalEditarBtn = document.getElementById('fecharModalEditarBtn');
    const formEditarDispositivo = document.getElementById('formEditarDispositivo');
    const idDispositivoInput = document.getElementById('idDispositivoEditar');
    const novoNomeInput = document.getElementById('novoNomeDispositivo');

    // --- ESTADO DA APLICAÇÃO ---
    let dispositivos = [];
    let html5QrCode;
    let stompClient;

    // --- FUNÇÕES ---
    function adicionarCardDispositivo(dispositivo) {
        const card = templateDispositivo.content.firstElementChild.cloneNode(true);
        card.dataset.id = dispositivo.uuid;
        card.querySelector('.card-titulo').textContent = dispositivo.name;
        atualizarCard(card, {
            status: dispositivo.status || 'Offline',
            temperatura: '--',
            umidade: '--',
            luminosidade: '--',
            ruido: '--',
            qualidadeAr: '--'
        });
        gridDispositivos.appendChild(card);
    }

    async function carregarDispositivos() {
        console.log(sessionStorage.getItem('authToken'));
        try {
            const response = await fetch('http://localhost:8086/User', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const erro = await response.text();
                alert(`Erro ao carregar dispositivos: ${erro}`);
                return;
            }

            const dados = await response.json();
            console.log('Resposta da API:', dados);

            const sensores = dados.sensors;
            if (!Array.isArray(sensores)) throw new Error('Formato de sensores inválido');

            dispositivos = sensores.map(dispositivo => ({
                uuid: dispositivo.uuid,
                name: dispositivo.nomePlaca || `Dispositivo - ${dispositivo.uuid?.slice(-4)}`,
                status: 'Online'
            }));

            dispositivos.forEach(dispositivo => {
                adicionarCardDispositivo(dispositivo);
            });

            // Só conecta ao WS após carregar os dispositivos
            conectarWebSocket();

        } catch (error) {
            console.error('Erro ao carregar dispositivos:', error);
            alert('Erro de rede ou formato inválido ao carregar dispositivos.');
        }
    }

    // Atualiza o card com os dados do sensor
    function atualizarCard(card, dados) {
        const isOnline = dados.status === 'Online';
        card.querySelector('.status-texto').textContent = dados.status || 'Offline';
        card.classList.toggle('online', isOnline);
        card.classList.toggle('offline', !isOnline);

        // As propriedades do backend tem snake_case, aqui convertemos para camelCase na atribuição
        card.querySelector('[data-sensor="temperatura"]').textContent = isOnline ? `${dados.temperatura ?? dados.Temperatura ?? '--'} °C` : '-- °C';
        card.querySelector('[data-sensor="umidade"]').textContent = isOnline ? `${dados.umidade ?? '--'} %` : '-- %';
        card.querySelector('[data-sensor="luminosidade"]').textContent = isOnline ? `${dados.luminosidade ?? '--'} Lux` : '-- Lux';
        card.querySelector('[data-sensor="ruido"]').textContent = isOnline ? `${dados.ruido ?? '--'} dB` : '-- dB';
        // qualidade do ar pode vir como qualidade_do_ar ou qualidadeAr (ajuste aqui)
        const qualidade = dados.qualidadeDoAr ?? '--';
        card.querySelector('[data-sensor="qualidadeAr"]').textContent = isOnline ? qualidade : '--';
    }

    // --- Conexão STOMP com SockJS ---
    function conectarWebSocket() {
        if (stompClient && stompClient.connected) {
            console.log('WebSocket já conectado');
            return;
        }

        const token = sessionStorage.getItem('authToken');
        const socket = new SockJS(`http://localhost:8086/ws`);
        stompClient = Stomp.over(socket);

        // Passa o token no header Authorization (jwt)
        stompClient.connect(
            { Authorization: `Bearer ${token}` },
            (frame) => {
                console.log('Conectado ao WebSocket STOMP:', frame);

                dispositivos.forEach(dispositivo => {
                    if (dispositivo.uuid && dispositivo.uuid.includes('-')) {
                        const topic = `/topic/placa/${dispositivo.uuid}`;
                        stompClient.subscribe(topic, (mensagem) => {
                            const dados = JSON.parse(mensagem.body);
                            console.log(`Dados recebidos de ${dispositivo.uuid}:`, dados);

                            const card = gridDispositivos.querySelector(`[data-id="${dispositivo.uuid}"]`);
                            if (card) {
                                // Atualiza o card com os dados do backend (status Online)
                                atualizarCard(card, { ...dados, status: 'Online' });
                            }
                        });
                        console.log(`Inscrito no tópico: ${topic}`);
                    } else {
                        console.warn(`UUID inválido ignorado: ${dispositivo.uuid}`);
                    }
                });
            },
            (erro) => {
                console.error('Erro na conexão STOMP:', erro);
                setTimeout(conectarWebSocket, 5000); // Tenta reconectar
            }
        );
    }

    // --- Funções do Modal QR Code ---
    const iniciarScanner = () => {
        modalQrCode.classList.add('visivel');
        html5QrCode = new Html5Qrcode("leitor-qr-code");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
            .catch(err => {
                console.error("Erro ao iniciar scanner QR:", err);
                alert("Erro ao iniciar a câmera.");
                fecharModalQr();
            });
    };

    const onScanSuccess = async (idDecodificado) => {
        fecharModalQr();
        if (dispositivos.some(d => d.uuid === idDecodificado)) {
            alert('Este dispositivo já foi adicionado.');
            return;
        }

        try {
            const urlBackend = 'http://localhost:8086/ws/uuid';
            const response = await fetch(urlBackend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ uuid: idDecodificado }),
            });

            if (response.ok) {
                const novoNome = `Dispositivo - ${idDecodificado.slice(-4)}`;
                const novoDispositivo = { uuid: idDecodificado, name: novoNome, status: 'Online' };
                dispositivos.push(novoDispositivo);
                adicionarCardDispositivo(novoDispositivo);

                if (stompClient && stompClient.connected) {
                    const topic = `/topic/placa/${novoDispositivo.uuid}`;
                    stompClient.subscribe(topic, (mensagem) => {
                        const dados = JSON.parse(mensagem.body);
                        const card = gridDispositivos.querySelector(`[data-id="${novoDispositivo.uuid}"]`);
                        if (card) atualizarCard(card, { ...dados, status: 'Online' });
                    });
                }

                alert(`Dispositivo "${novoNome}" adicionado com sucesso!`);
            } else {
                const erro = await response.text();
                alert(`Erro ao adicionar dispositivo: ${erro}`);
            }
        } catch (error) {
            console.error('Erro ao conectar ao backend:', error);
            alert('Erro de conexão com o servidor.');
        }
    };

    const fecharModalQr = () => {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(err => console.error("Erro ao parar o scanner.", err));
        }
        modalQrCode.classList.remove('visivel');
    };

    // --- Modal de Edição ---
    const abrirModalEditar = (uuid) => {
        const dispositivo = dispositivos.find(d => d.uuid === uuid);
        if (dispositivo) {
            idDispositivoInput.value = dispositivo.uuid;
            novoNomeInput.value = dispositivo.name;
            modalEditar.classList.add('visivel');
        }
    };

    const fecharModalEditar = () => {
        modalEditar.classList.remove('visivel');
    };

    const salvarAlteracoesDispositivo = async (event) => {
        event.preventDefault();
        const uuid = idDispositivoInput.value;
        const novoNome = novoNomeInput.value.trim();

        if (novoNome) {
            try {
                const urlEditar = `http://localhost:8086/api/dispositivos/${uuid}/nome`;
                const response = await fetch(urlEditar, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: novoNome }),
                });

                if (response.ok) {
                    const dispositivo = dispositivos.find(d => d.uuid === uuid);
                    if (dispositivo) {
                        dispositivo.name = novoNome;
                        const card = gridDispositivos.querySelector(`[data-id="${uuid}"]`);
                        if (card) card.querySelector('.card-titulo').textContent = novoNome;
                    }
                    alert('Nome atualizado com sucesso!');
                    fecharModalEditar();
                } else {
                    const erro = await response.text();
                    alert(`Erro ao atualizar: ${erro}`);
                }
            } catch (error) {
                console.error('Erro ao salvar novo nome:', error);
                alert('Erro de rede.');
            }
        } else {
            alert('O nome não pode ser vazio.');
        }
    };

    // --- EVENTOS ---
    adicionarDispositivoBtn.addEventListener('click', iniciarScanner);
    fecharModalQrBtn.addEventListener('click', fecharModalQr);
    modalQrCode.addEventListener('click', (event) => {
        if (event.target === modalQrCode) fecharModalQr();
    });

    gridDispositivos.addEventListener('click', (event) => {
        const botaoEditar = event.target.closest('.botao-editar');
        if (botaoEditar) {
            const card = botaoEditar.closest('.card-dispositivo');
            if (card) abrirModalEditar(card.dataset.id);
        }
    });

    formEditarDispositivo.addEventListener('submit', salvarAlteracoesDispositivo);
    fecharModalEditarBtn.addEventListener('click', fecharModalEditar);
    modalEditar.addEventListener('click', (event) => {
        if (event.target === modalEditar) fecharModalEditar();
    });

    // --- INICIALIZAÇÃO ---
    carregarDispositivos();

});
