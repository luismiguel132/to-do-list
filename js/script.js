// Funcionalidades V1
// [x]Adicionar Tarefas
// [x]O usuário pode marcar uma tarefa como concluída, o que a diferencia visualmente das tarefas pendentes.
// [x]As tarefas são salvas no armazenamento local do navegador para que não se percam ao recarregar a página.
// [-]O usuário pode adicionar uma nova tarefa com um título e descrição.
// [x]O usuário pode excluir tarefas.
// [x]Editar Tarefas
// [x]Aplicar estilização no Excluir e Editar
// [x]O usuário pode filtrar tarefas por "Todas", "Concluídas" e "Pendentes".
// [x]Filtrar Tarefas
// [X]Cor de fundo das tarefas
// [X]Verificar se há uma tarefa com mesmo nome e a excluir se sim
// [X]Modo escuro e claro
// [X]Organizar menu hamburger
// [ ]Pesquisar tarefas

//ideias do chat gpt


// [ ]Adicionar data de criação
// [ ]Subtarefas
// [ ]Prioridade das Tarefas (Baixa, Média, Alta)
// [ ]Notificações de Vencimento
// [ ]Tarefas Repetitivas (Diárias, Semanais, Mensais)
// [ ]Classificação das Tarefas por Data ou Prioridade
// [ ]Integração com Calendário (Google Calendar)
// [ ]Comentários nas Tarefas
// [ ]Exportar Tarefas (CSV ou PDF)
// [ ]Arrastar e Soltar (Drag & Drop)
// [ ]Histórico de Tarefas Concluídas
// [ ]Gestão de Tarefas por Categoria (Ex: Trabalho, Casa, Estudos)
// [ ]Histórico de Edição de Tarefas

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

        document.getElementById(`tarefaFormulario${this.id}`).addEventListener('submit', (event) => {
            event.preventDefault();
            const inputTarefa = document.getElementById(`inputTarefa${this.id}`);
            const textoTarefa = inputTarefa.value;

            if (textoTarefa !== '') {
                this.adicionarTarefa(textoTarefa);
                inputTarefa.value = '';
            }
        });

        // Configurar filtros
        document.getElementById(`filtroTodas${this.id}`).addEventListener('click', () => {
            this.filtroAtual = 'todas';
            this.atualizarListaTarefas();
        });

        document.getElementById(`filtroConcluidas${this.id}`).addEventListener('click', () => {
            this.filtroAtual = 'concluidas';
            this.atualizarListaTarefas();
        });

        document.getElementById(`filtroPendentes${this.id}`).addEventListener('click', () => {
            this.filtroAtual = 'pendentes';
            this.atualizarListaTarefas();
        });
    }
}

// Inicializar as três listas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const lista1 = new ListaTarefas('');  // Lista principal (mantém IDs originais para compatibilidade)
    const lista2 = new ListaTarefas('2');
    const lista3 = new ListaTarefas('3');

    // Configurar pesquisa global
    const inputPesquisa = document.getElementById("Input__pesquisa");
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', () => {
            lista1.atualizarListaTarefas();
            lista2.atualizarListaTarefas();
            lista3.atualizarListaTarefas();
        });
    }
});