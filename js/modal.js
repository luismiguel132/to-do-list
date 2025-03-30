const modal_tarefas = document.querySelector('.criar__tarefas');
const modal_button_abrir = document.querySelector('.abrir_modal');
const modal_button_fechar = document.querySelector('.fechar_modal');
const overlay = document.querySelector('.overlay');

modal_button_abrir.addEventListener('click', () => {
    overlay.style.display = 'block'; 
    modal_tarefas.style.display = 'flex'; 
    setTimeout(() => {
        overlay.style.opacity = '1'; 
        modal_tarefas.style.opacity = '1'; 
    }, 10);
});

modal_button_fechar.addEventListener('click', () => {
    overlay.style.opacity = '0'; 
    modal_tarefas.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none'; 
        modal_tarefas.style.display = 'none'; l
    }, 500);
});

overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    modal_tarefas.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        modal_tarefas.style.display = 'none';
    }, 500);
});

