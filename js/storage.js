function salvarListas(listas) {
    localStorage.setItem('listas_personalizadas', JSON.stringify(listas));
}

function carregarListas() {
    const listasArmazenadas = localStorage.getItem('listas_personalizadas');
    return listasArmazenadas ? JSON.parse(listasArmazenadas) : [];
}