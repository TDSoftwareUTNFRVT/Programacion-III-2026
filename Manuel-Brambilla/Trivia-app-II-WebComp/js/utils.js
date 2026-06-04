function decodificarHTML(texto) {
    const el = document.createElement('textarea');
    el.innerHTML = texto;
    return el.value;
}

function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function estilosBase() {
    return `
        *{
            box-sizing: border-box;
        }
        .card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 10px;
            padding: 2em;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 1px 6px rgba(0,0,0,0.06);
        }
        @media (max-width: 480px) {
            .card {
                padding: 1.2em;
                border-radius: 6px;
            }
        }
    `;
}