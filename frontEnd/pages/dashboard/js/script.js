// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const gridDispositivos = document.getElementById('dispositivosGrid');
    const templateDispositivo = document.getElementById('templateDispositivo');
    
    // --- LÓGICA DE ADICIONAR REMOVIDA PARA TESTE ---
    const adicionarDispositivoBtn = document.getElementById('adicionarDispositivoBtn');
    if (adicionarDispositivoBtn) {
        adicionarDispositivoBtn.addEventListener('click', () => {
            alert('Funcionalidade de adicionar desativada para teste de edição.');
        });
    }

    // Modal Editar
    const modalEditar = document.getElementById('modalEditarDispositivo');
    const fecharModalEditarBtn = document.getElementById('fecharModalEditarBtn');
    const formEditarDispositivo = document.getElementById('formEditarDispositivo');
    const idDispositivoInput = document.getElementById('idDispositivoEditar');
    const novoNomeInput = document.getElementById('novoNomeDispositivo');

    // --- ESTADO INICIAL DOS DADOS ---
    let dispositivos = [
        { id: 'rasp-001', name: 'Raspberry Pi - Quarto 101', status: 'Online' },
        { id: 'rasp-002', name: 'Sensor Corredor B', status: 'Offline' },
        { id: 'rasp-003', name: 'Raspberry Pi - Lab 03', status: 'Online' }
    ];

    // --- FUNÇÕES ---

    /**
     * Renderiza ou atualiza os cards de dispositivos na tela.
     */
    const renderizarDispositivos = () => {
        // Limpa a grid antes de renderizar para garantir uma nova lista limpa.
        gridDispositivos.innerHTML = '';

        dispositivos.forEach(dispositivo => {
            const card = templateDispositivo.content.firstElementChild.cloneNode(true);
            card.dataset.id = dispositivo.id;
            card.querySelector('.card-titulo').textContent = dispositivo.name;
            card.querySelector('.status-texto').textContent = dispositivo.status;
            card.classList.toggle('online', dispositivo.status === 'Online');
            card.classList.toggle('offline', dispositivo.status === 'Offline');
            atualizarDadosSensor(card, dispositivo);
            gridDispositivos.appendChild(card);
        });
    };

    /**
     * Atualiza os valores dos sensores em um card específico.
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
                if (Math.random() < 0.2) {
                    dispositivo.status = dispositivo.status === 'Online' ? 'Offline' : 'Online';
                }
            });
            renderizarDispositivos();
        }, 5000);
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

    const salvarAlteracoesDispositivo = (event) => {
        event.preventDefault();
        const id = idDispositivoInput.value;
        const novoNome = novoNomeInput.value.trim();

        if (novoNome) {
            const dispositivo = dispositivos.find(d => d.id === id);
            if (dispositivo) {
                dispositivo.name = novoNome;
                // A função renderizarDispositivos vai redesenhar o card com o novo nome
                renderizarDispositivos(); 
            }
            fecharModalEditar();
        } else {
            alert('O nome do dispositivo não pode ficar em branco.');
        }
    };

    // --- EVENT LISTENERS ---

    // Event Delegation para os botões de editar nos cards
    gridDispositivos.addEventListener('click', (event) => {
        const botaoEditar = event.target.closest('.botao-editar');
        if (botaoEditar) {
            const card = botaoEditar.closest('.card-dispositivo');
            if (card) {
                abrirModalEditar(card.dataset.id);
            }
        }
    });

    // Listeners para o Modal de Edição
    formEditarDispositivo.addEventListener('submit', salvarAlteracoesDispositivo);
    fecharModalEditarBtn.addEventListener('click', fecharModalEditar);
    modalEditar.addEventListener('click', (event) => {
        if (event.target === modalEditar) fecharModalEditar();
    });

    // --- INICIALIZAÇÃO ---
    renderizarDispositivos();
    simularAtualizacoes();
});