document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const gridDispositivos = document.getElementById('dispositivosGrid');
    const templateDispositivo = document.getElementById('templateDispositivo');
    const adicionarDispositivoBtn = document.getElementById('adicionarDispositivoBtn');
    const modal = document.getElementById('modalQrCode');
    const fecharModalBtn = document.getElementById('fecharModalBtn');

    // --- ESTADO INICIAL DOS DADOS ---
    let dispositivos = [
        { id: 'rasp-001', name: 'Raspberry Pi - Quarto 101', status: 'Online' },
        { id: 'rasp-002', name: 'Sensor Corredor B', status: 'Offline' },
        { id: 'rasp-003', name: 'Raspberry Pi - Lab 03', status: 'Online' }
    ];

    let html5QrCode;

    // --- FUNÇÕES ---

    /**
     * Renderiza ou atualiza os cards de dispositivos na tela.
     */
    const renderizarDispositivos = () => {
        // Limpa a grid para evitar duplicatas, mas mantém os dados existentes para uma atualização mais suave
        const cardsExistentes = new Map(
            Array.from(gridDispositivos.children).map(card => [card.dataset.id, card])
        );

        dispositivos.forEach(dispositivo => {
            const card = cardsExistentes.get(dispositivo.id) || templateDispositivo.content.firstElementChild.cloneNode(true);
            card.dataset.id = dispositivo.id;

            // Define o nome e status
            card.querySelector('.card-titulo').textContent = dispositivo.name;
            card.querySelector('.status-texto').textContent = dispositivo.status;

            // Atualiza a classe de status para aplicar o CSS correto
            card.classList.toggle('online', dispositivo.status === 'Online');
            card.classList.toggle('offline', dispositivo.status === 'Offline');

            // Atualiza os dados dos sensores
            atualizarDadosSensor(card, dispositivo);
            
            // Adiciona o card à grid se for novo
            if (!cardsExistentes.has(dispositivo.id)) {
                gridDispositivos.appendChild(card);
            }
        });
    };

    /**
     * Atualiza os valores dos sensores em um card específico.
     * @param {HTMLElement} card O elemento do card a ser atualizado.
     * @param {Object} dispositivo O objeto do dispositivo contendo os dados.
     */
    const atualizarDadosSensor = (card, dispositivo) => {
        const qualidadeArOpcoes = ['Boa', 'Moderada', 'Ruim', 'Péssima'];
        const isOnline = dispositivo.status === 'Online';
        
        card.querySelector('[data-sensor="temperatura"]').textContent = isOnline ? `${(Math.random() * 10 + 18).toFixed(1)} °C` : '-- °C';
        card.querySelector('[data-sensor="umidade"]').textContent = isOnline ? `${Math.floor(Math.random() * 40 + 30)} %` : '-- %';
        card.querySelector('[data-sensor="luminosidade"]').textContent = isOnline ? `${Math.floor(Math.random() * 800 + 100)} Lux` : '-- Lux';
        card.querySelector('[data-sensor="ruido"]').textContent = isOnline ? `${Math.floor(Math.random() * 40 + 10)} dB` : '-- dB';
        card.querySelector('[data-sensor="qualidadeAr"]').textContent = isOnline ? qualidadeArOpcoes[Math.floor(Math.random() * qualidadeArOpcoes.length)] : '--';
    };
    
    /**
     * Simula atualizações de status e dados dos sensores em tempo real.
     */
    const simularAtualizacoes = () => {
        setInterval(() => {
            dispositivos.forEach(dispositivo => {
                // Chance de 20% de mudar o status a cada ciclo
                if (Math.random() < 0.2) {
                    dispositivo.status = dispositivo.status === 'Online' ? 'Offline' : 'Online';
                }
            });
            renderizarDispositivos();
        }, 5000); // Atualiza a cada 5 segundos
    };

    /**
     * Inicia o leitor de QR code.
     */
    const iniciarScanner = () => {
        modal.classList.add('visivel');
        html5QrCode = new Html5Qrcode("leitor-qr-code");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        // Inicia a câmera e o scanner
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
            .catch(err => {
                console.error("Não foi possível iniciar o scanner de QR Code.", err);
                alert("Erro ao iniciar a câmera. Verifique as permissões.");
                fecharModal();
            });
    };
    
    /**
     * Função callback para quando um QR code é lido com sucesso.
     * @param {string} idDecodificado O ID lido do QR Code.
     */
    const onScanSuccess = (idDecodificado) => {
        fecharModal();
        console.log(`QR Code lido com sucesso: ${idDecodificado}`);
        
        // Verifica se o dispositivo já existe
        if (dispositivos.some(d => d.id === idDecodificado)) {
            alert('Este dispositivo já foi adicionado.');
            return;
        }
        
        // Adiciona um novo dispositivo
        const novoNome = `Novo Dispositivo - ${idDecodificado.slice(-4)}`;
        const novoDispositivo = { id: idDecodificado, name: novoNome, status: 'Online' };
        dispositivos.push(novoDispositivo);
        
        // Renderiza a lista atualizada
        renderizarDispositivos();
        alert(`Dispositivo "${novoNome}" adicionado com sucesso!`);
    };

    /**
     * Para o leitor de QR code e fecha o modal.
     */
    const fecharModal = () => {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                console.log("Scanner de QR Code parado.");
            }).catch(err => {
                console.error("Erro ao parar o scanner.", err);
            });
        }
        modal.classList.remove('visivel');
    };

    // --- EVENT LISTENERS ---
    adicionarDispositivoBtn.addEventListener('click', iniciarScanner);
    fecharModalBtn.addEventListener('click', fecharModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            fecharModal();
        }
    });

    // --- INICIALIZAÇÃO ---
    renderizarDispositivos();
    simularAtualizacoes();
});