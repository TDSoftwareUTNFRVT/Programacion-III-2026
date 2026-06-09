const button = document.getElementById('button');
const apply = document.getElementById('apply');
const text = document.getElementById('text');

function change() {
            button.style.backgroundColor = document.getElementById('color').value;
            button.style.color = document.getElementById('colorText').value;
            button.textContent = text.value || 'Botón';
        }

		apply.onclick = change;
		change();
