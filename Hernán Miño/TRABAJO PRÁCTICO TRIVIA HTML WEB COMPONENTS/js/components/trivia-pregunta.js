class TriviaPregunta extends HTMLElement {
    constructor(){
        super();
        this.shadow = this.attachShadow({mode:'open'});
    }
    render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .pregunta {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 24px;
          color: #111111;
        }

        .opciones {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .opcion {
          background: white;
          color: #111111;
          border: 1px solid #d0d0d0;
          border-radius: 4px;
          padding: 14px 18px;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
        }

        .opcion:hover {
          background: #e0e0e0;
        }

        .opcion:disabled {
          cursor: default;
        }

        .opcion.correcto {
          background: #111111;
          color: white;
          border-color: #111111;
        }

        .opcion.incorrecto {
          background: #e0e0e0;
          color: #666666;
          text-decoration: line-through;
        }
      </style>

      <p class="pregunta"></p>
      <div class="opciones"></div>
    `;
  }

  cargarPregunta(pregunta,opciones){
    this.render();
    const p = this.shadow.querySelector('.pregunta');
    p.textContent = pregunta;
    const contenedor= this.shadow.querySelector('.opciones');
    opciones.forEach(opcion =>{
        const btn = document.createElement('button');
        btn.className = 'opcion';
        btn.textContent = opcion;
        btn.addEventListener('click', () => this.manejarClick(btn,opcion));
        contenedor.appendChild(btn)
    })
  }

  manejarClick(botonClickeado,opcionElegida){
    this.shadow.querySelectorAll('.opcion').forEach(btn =>{
        btn.disabled = true;
    });
    const evento = new CustomEvent('respuesta',{
        bubbles : true,
        compossed : true,
        detail:{opcionElegida}
    });
    this.dispatchEvent(evento);
  }

  mostrarFeedback(opcionCorrecta){
    this.shadow.querySelectorAll('.opcion').forEach(btn => {
        if (btn.textContent === opcionCorrecta) {
            btn.classList.add('correcto');
        } else if (btn.disabled && !btn.classList.contains('correcto')){
            btn.classList.add('incorrecto');
        }
    });
  }


}

customElements.define('trivia-pregunta', TriviaPregunta);
