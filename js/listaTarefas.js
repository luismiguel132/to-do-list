class ListaTarefas {
    constructor(id) {
        this.id = id;
        this.tarefas = [];
        this.filtroAtual = 'todas';
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
            concluida: false
        };

        if (this.tarefas.some(t => this.formatarTarefa(t.texto) === this.formatarTarefa(textoTarefa))) {
            this.exibirToast();
            return;
        }

        this.tarefas.push(tarefa);
        this.salvarTarefas();
        this.atualizarListaTarefas();
        
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
        // Verificar se a lista existe antes de tentar carregar as tarefas
        const listaTarefasEl = document.getElementById(`listaTarefas${this.id}`);
        if (!listaTarefasEl) {
            console.error(`Lista de tarefas com ID listaTarefas${this.id} não encontrada.`);
            return;
        }

        this.carregarTarefas();

        // Verificar se o formulário existe antes de adicionar o event listener
        const formulario = document.getElementById(`tarefaFormulario${this.id}`);
        if (formulario) {
            formulario.addEventListener('submit', (event) => {
                event.preventDefault();
                const inputTarefa = document.getElementById(`inputTarefa${this.id}`);
                const textoTarefa = inputTarefa.value;

                if (textoTarefa !== '') {
                    this.adicionarTarefa(textoTarefa);
                    inputTarefa.value = '';
                }
            });
        } else {
            console.error(`Formulário com ID tarefaFormulario${this.id} não encontrado.`);
        }

        // Verificar se os botões de filtro existem antes de adicionar os event listeners
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