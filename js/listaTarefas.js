let todasAsListas = [];

console.log('listaTarefas.js carregado', todasAsListas);

class ListaTarefas {
    constructor(id) {
        this.id = id;
        this.tarefas = [];
        this.filtroAtual = 'todas';
        todasAsListas.push(this);
        this.inicializar();
    }

    carregarTarefas() {
        const armazenamentoTarefas = localStorage.getItem(`tarefas_${this.id}`);
        if (armazenamentoTarefas) {
            this.tarefas = JSON.parse(armazenamentoTarefas);
        }
        this.atualizarListaTarefas();
    }

    salvarTarefas() {
        localStorage.setItem(`tarefas_${this.id}`, JSON.stringify(this.tarefas));
    }

    adicionarTarefa(textoTarefa) {
        const tarefa = {
            texto: textoTarefa,
            concluida: false,
            descricao: " "
        };

        if (this.tarefas.some(t => this.formatarTarefa(t.texto) === this.formatarTarefa(textoTarefa))) {
            this.exibirToast();
            return;
        }

        this.tarefas.push(tarefa);
        this.salvarTarefas();
        this.atualizarListaTarefas();
        console.log(textoTarefa);
    }

    formatarTarefa(textoTarefa) {
        return textoTarefa
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '');
    }

    exibirToast() {
        const toastElement = document.getElementById('toast-alert');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    removerTarefa(index) {
        this.tarefas.splice(index, 1);
        this.salvarTarefas();
        this.atualizarListaTarefas();
    }

    editarTarefa(index) {
        const novoTexto = prompt("Edite a tarefa:", this.tarefas[index].texto);
        if (novoTexto !== '' && novoTexto !== null) {
            this.tarefas[index].texto = novoTexto;
            this.salvarTarefas();
            this.atualizarListaTarefas();
        }
    }

    filtrarTarefas() {
        if (this.filtroAtual === 'concluidas') {
            return this.tarefas.filter(tarefa => tarefa.concluida);
        } else if (this.filtroAtual === 'pendentes') {
            return this.tarefas.filter(tarefa => !tarefa.concluida);
        }
        return this.tarefas;
    }

    atualizarListaTarefas() {
        const listaTarefas = document.getElementById(`listaTarefas${this.id}`);
        if (!listaTarefas) {
            console.error(`Elemento com ID listaTarefas${this.id} não encontrado.`);
            return;
        }
        const inputPesquisa = document.getElementById("Input__pesquisa");
        listaTarefas.innerHTML = '';

        const tarefasFiltradas = this.filtrarTarefas()
            .filter(tarefa => tarefa.texto.toLowerCase().includes(inputPesquisa?.value?.toLowerCase() || ''));

        tarefasFiltradas.forEach((tarefa, index) => {
            const itemTarefa = document.createElement('li');
            itemTarefa.className = tarefa.concluida ? 'list-group-item task-completed' : 'list-group-item';

            const textoTarefa = document.createElement('span');
            textoTarefa.textContent = tarefa.texto;
            textoTarefa.className = 'texto-tarefa';

            textoTarefa.addEventListener('click', () => {
                this.tarefas[index].concluida = !this.tarefas[index].concluida;
                this.salvarTarefas();
                this.atualizarListaTarefas();
            });

            itemTarefa.appendChild(textoTarefa);

            const botoesLi = document.createElement('div');
            botoesLi.className = 'div-botoesLi';

            const botaoExcluir = document.createElement('button');
            botaoExcluir.className = 'btn btn-secondary buttomsLi';
            botaoExcluir.onclick = () => this.removerTarefa(index);

            const botaoEditar = document.createElement('button');
            botaoEditar.className = 'btn btn-secondary buttomsLi';
            botaoEditar.onclick = () => this.editarTarefa(index);

            const iconEditar = document.createElement('i');
            iconEditar.className = 'bi bi-pencil-fill';

            const iconExcluir = document.createElement('i');
            iconExcluir.className = 'bi bi-x iconExcluir';

            botoesLi.appendChild(botaoExcluir);
            botoesLi.appendChild(botaoEditar);
            botaoEditar.appendChild(iconEditar);
            botaoExcluir.appendChild(iconExcluir);

            itemTarefa.appendChild(botoesLi);
            listaTarefas.appendChild(itemTarefa);
        });
    }

    inicializar() {
        this.carregarTarefas();

        // Configurar o botão de abrir modal para esta lista
        const modalButtonAbrir = document.querySelector(`.abrir__modal[data-lista-id="${this.id}"]`);
        const modalForm = document.getElementById('modalTarefaForm');
        const overlay = document.querySelector('.overlay');
        const modalTarefas = document.querySelector('.criar__tarefas');
        const modalButtonFechar = document.querySelector('.fechar__modal');
        const listaIdInput = document.getElementById('listaId');

        // Abrir modal e definir o ID da lista
        if (modalButtonAbrir) {
            modalButtonAbrir.addEventListener('click', () => {
                overlay.style.display = 'block';
                modalTarefas.style.display = 'flex';
                listaIdInput.value = this.id; // Define o ID da lista no campo oculto
                setTimeout(() => {
                    overlay.style.opacity = '1';
                    modalTarefas.style.opacity = '1';
                }, 10);
            });
        }

        // Fechar modal
        const fecharModal = () => {
            overlay.style.opacity = '0';
            modalTarefas.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                modalTarefas.style.display = 'none';
            }, 500);
        };

        if (modalButtonFechar) {
            modalButtonFechar.addEventListener('click', fecharModal);
        }
        if (overlay) {
            overlay.addEventListener('click', fecharModal);
        }

        // Enviar tarefa via modal (configurado apenas uma vez no app.js, mas mantido aqui como fallback)
        if (modalForm && !modalForm.dataset.listenerAdded) {
            modalForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const inputTarefa = document.getElementById('inputTarefaModal');
                const textoTarefa = inputTarefa.value.trim();
                const listaId = listaIdInput.value;
                if (textoTarefa && listaId !== undefined) {
                    const lista = todasAsListas.find(l => l.id === listaId);
                    if (lista) {
                        lista.adicionarTarefa(textoTarefa);
                        inputTarefa.value = '';
                        fecharModal();
                    }
                }
            });
            modalForm.dataset.listenerAdded = 'true'; // Evita múltiplos listeners
        }

        // Configurar filtros
        const filtroTodas = document.getElementById(`filtroTodas${this.id}`);
        const filtroConcluidas = document.getElementById(`filtroConcluidas${this.id}`);
        const filtroPendentes = document.getElementById(`filtroPendentes${this.id}`);

        if (filtroTodas) {
            filtroTodas.addEventListener('click', () => {
                this.filtroAtual = 'todas';
                this.atualizarListaTarefas();
            });
        }

        if (filtroConcluidas) {
            filtroConcluidas.addEventListener('click', () => {
                this.filtroAtual = 'concluidas';
                this.atualizarListaTarefas();
            });
        }

        if (filtroPendentes) {
            filtroPendentes.addEventListener('click', () => {
                this.filtroAtual = 'pendentes';
                this.atualizarListaTarefas();
            });
        }
    }
}