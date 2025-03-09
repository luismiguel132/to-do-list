// Função para criar uma nova lista no DOM
function criarListaNoDom(id, nome) {
    const novaColuna = document.createElement('div');
    novaColuna.className = 'col-md-4 mb-4';
    novaColuna.id = `coluna-${id}`;
    novaColuna.innerHTML = `
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3 class="card-title mb-0">${nome}</h3>
                <button class="btn btn-danger btn-sm excluir-lista" data-lista-id="${id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="card-body">
                <form id="tarefaFormulario${id}" class="form-inline justify-content-center">
                    <div class="input-group mb-3">
                        <input type="text" id="inputTarefa${id}" class="form-control" placeholder="Nova Tarefa">
                        <button type="submit" class="btn btn-primary"><i class="bi bi-plus-circle-fill"></i></button>
                    </div>
                </form>
                <div id="filtrosTarefas${id}" class="mb-3">
                    <button id="filtroTodas${id}" class="btn btn-sm btn-secondary buttomFilter">Todas</button>
                    <button id="filtroConcluidas${id}" class="btn btn-sm btn-secondary buttomFilter">Concluídas</button>
                    <button id="filtroPendentes${id}" class="btn btn-sm btn-secondary buttomFilter">Pendentes</button>
                </div>
                <ul id="listaTarefas${id}" class="list-group"></ul>
                <div id="statusTarefas${id}" class="mt-3"></div>
            </div>
        </div>
    `;

    document.querySelector('.row').appendChild(novaColuna);
    
    // Adicionar evento de clique ao botão de excluir
    const botaoExcluir = novaColuna.querySelector('.excluir-lista');
    botaoExcluir.addEventListener('click', () => excluirLista(id));
}

// Função para excluir uma lista
function excluirLista(id) {
    
        // Remover a lista do DOM
        const coluna = document.getElementById(`coluna-${id}`);
        if (coluna) {
            coluna.remove();
        }
        
        // Remover a lista do localStorage
        const listasPersonalizadas = carregarListas();
        const listasAtualizadas = listasPersonalizadas.filter(lista => lista.id !== id);
        salvarListas(listasAtualizadas);
        
        // Remover as tarefas associadas a esta lista
        localStorage.removeItem(`tarefas_${id}`);
    
}