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

let tarefas = []
let filtroAtual = 'todas'

function carregarTarefas(){
  const armazenamentoTarefas = localStorage.getItem('tarefas')
  if(armazenamentoTarefas){
    tarefas = JSON.parse(armazenamentoTarefas)
  }
  atualizarListaTarefas()
}

function adicionarTarefa(textoTarefa){
    const tarefa = {
      texto: textoTarefa,
      concluida: false
    }

    if(tarefas.some(tarefa => formatarTarefa(tarefa.texto) === formatarTarefa(textoTarefa) )) {
      exibirToast()
      return
    }

    tarefas.push(tarefa)
    salvarTarefas()
    atualizarListaTarefas()
}

function formatarTarefa(textoTarefa){
  return textoTarefa
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '')
}

function exibirToast(){
    const toastElement = document.getElementById('toast-alert')
    const toast = new bootstrap.Toast(toastElement)
    toast.show()
}

function salvarTarefas(){
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

const inputPesquisa = document.getElementById("Input__pesquisa")

function atualizarListaTarefas(){
  const listaTarefas = document.getElementById('listaTarefas')
  listaTarefas.innerHTML = ''
  const tarefasFiltradas = filtrarTarefas().filter(tarefa => tarefa.texto.toLowerCase().includes(inputPesquisa.value.toLowerCase()))
  

  tarefasFiltradas.forEach((tarefa, index) => {
    const itemTarefa = document.createElement('li')
    itemTarefa.className = tarefa.concluida ? 'list-group-item task-completed' : 'list-group-item';

    const textoTarefa = document.createElement('span')
    textoTarefa.textContent = tarefa.texto
    textoTarefa.className = 'texto-tarefa';

    textoTarefa.addEventListener('click', function(){
      tarefas[index].concluida = !tarefas[index].concluida;
      salvarTarefas()
      atualizarListaTarefas()
    })

    itemTarefa.appendChild(textoTarefa)

    const botoesLi = document.createElement('div')
    itemTarefa.appendChild(botoesLi)
    botoesLi.className = 'div-botoesLi' 

      
    const botaoExcluir = document.createElement('button');
    botaoExcluir.className = 'btn btn-secondary buttomsLi';
    botaoExcluir.onclick = function() {
      removerTarefa(index);
    };

    const botaoEditar = document.createElement('button');
    botaoEditar.className = 'btn btn-secondary  buttomsLi';
    botaoEditar.onclick = function() {
      editarTarefa(index);
    };

    const iconEditar = document.createElement('i');
    iconEditar.className = 'bi bi-pencil-fill';

    const iconExcluir = document.createElement('i');
    iconExcluir.className = 'bi bi-x iconExcluir';

    botoesLi.appendChild(botaoExcluir);
    botoesLi.appendChild(botaoEditar);
    botaoEditar.appendChild(iconEditar);
    botaoExcluir.appendChild(iconExcluir);

    
    console.log("TarefasConcluídas", (tarefas.filter(tarefa => tarefa.concluida === true)))
    listaTarefas.appendChild(itemTarefa)
    
  })
}


function removerTarefa(index){
  tarefas.splice(index, 1)
  salvarTarefas()
  atualizarListaTarefas()
}

function editarTarefa(index){
  var novoTexto = prompt("Edite a tarefa:", tarefas[index].texto)
  if(novoTexto !== '' && novoTexto !== null){
    tarefas[index].texto = novoTexto
    salvarTarefas()
    atualizarListaTarefas()
  }
}

function inicializarApp(){
  carregarTarefas()

  inputPesquisa.addEventListener('input', function() {
    atualizarListaTarefas()
  })

  document.getElementById('tarefaFormulario').addEventListener('submit', function(event){
    event.preventDefault()
    const inputTarefa = document.getElementById('inputTarefa');
    const textoTarefa = inputTarefa.value

    if(textoTarefa !== ''){
      adicionarTarefa(textoTarefa);
      inputTarefa.value = ''
    }
  })
}


function filtrarTarefas(){
  if(filtroAtual === 'concluidas'){
    return tarefas.filter(tarefa => tarefa.concluida)
  } else if (filtroAtual === 'pendentes'){
    return tarefas.filter(tarefa => !tarefa.concluida)
  }
  return tarefas
}

document.getElementById("filtroTodas").addEventListener('click', function(){
  filtroAtual = 'todas'
  atualizarListaTarefas()
})

document.getElementById("filtroConcluidas").addEventListener('click', function(){
  filtroAtual = 'concluidas'
  atualizarListaTarefas()
})

document.getElementById("filtroPendentes").addEventListener('click', function(){
  filtroAtual = 'pendentes'
  atualizarListaTarefas()
})



document.addEventListener('DOMContentLoaded', inicializarApp)