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
// [x]Pesquisar tarefas

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


// Inicializar as três listas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar IDs às colunas das listas padrão para referência
    const colunasPadrao = document.querySelectorAll('.col-md-4.mb-4');
    if (colunasPadrao.length >= 3) {
        colunasPadrao[0].id = 'coluna-lista-padrao-1';
        colunasPadrao[1].id = 'coluna-lista-padrao-2';
        colunasPadrao[2].id = 'coluna-lista-padrao-3';
    }

    new ListaTarefas('');  // Lista principal (mantém IDs originais para compatibilidade)
    new ListaTarefas('2');
    new ListaTarefas('3');

    // Configurar pesquisa global **** funcionando em partes
    const inputPesquisa = document.getElementById("Input__pesquisa");
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', () => {
            todasAsListas.forEach(lista => lista.atualizarListaTarefas());
            console.log("todas as listas >>", todasAsListas);
        });
    }

    // Carregar listas personalizadas do localStorage
    const listasPersonalizadas = carregarListas();
    listasPersonalizadas.forEach(lista => {
        criarListaNoDom(lista.id, lista.nome);
        
        // Inicializar a lista após o DOM ser atualizado
        window.requestAnimationFrame(() => {
            const novaLista = new ListaTarefas(lista.id);
        });
    });
});

document.getElementById('novaListaFormulario').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Formulário de nova lista submetido');
    const inputNovaLista = document.getElementById('inputNovaLista');
    const nomeLista = inputNovaLista.value.trim();

    if (nomeLista !== '') {
        const novaListaId = `lista${Date.now()}`;
        
        // Criar a nova lista no DOM
        criarListaNoDom(novaListaId, nomeLista);
        
        // Salvar a nova lista no localStorage
        const listasPersonalizadas = carregarListas();
        listasPersonalizadas.push({
            id: novaListaId,
            nome: nomeLista
        });
        salvarListas(listasPersonalizadas);
        
        // Inicializar a lista após o DOM ser atualizado
        window.requestAnimationFrame(() => {
            const novaLista = new ListaTarefas(novaListaId);
        });

        inputNovaLista.value = '';
    }
});