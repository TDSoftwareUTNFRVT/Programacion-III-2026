type StatusState = "idle" | "loading" | "error" | "empty";

export class AppStatus extends HTMLElement {
  private shadow: ShadowRoot;

  static get observedAttributes(): string[] {
    return ["state", "message"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.update();
  }

  attributeChangedCallback(): void {
    this.update();
  }

  private update(): void {
    const state = (this.getAttribute("state") ?? "idle") as StatusState;
    const message = this.getAttribute("message") ?? "";

    this.shadow.innerHTML = `
      <style>
        :host { display: block; text-align: center; padding: 2rem 0; }
        .hidden { display: none; }
        .spinner {
          width: 40px; height: 40px; margin: 0 auto 1rem;
          border: 4px solid #504945;
          border-top-color: #fe8019;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-msg { color: #fb4934; font-size: .95rem; }
        .empty-msg { color: #a89984; font-size: .95rem; }
        .loading-msg { color: #bdae93; font-size: .9rem; }
      </style>
      ${state === "loading" ? `
        <div class="spinner"></div>
        <p class="loading-msg">Buscando libros...</p>
      ` : ""}
      ${state === "error" ? `
        <p class="error-msg"> ${message || "Ocurrió un error."}</p>
      ` : ""}
      ${state === "empty" ? `
        <p class="empty-msg"> ${message || "No se encontraron resultados."}</p>
      ` : ""}
    `;
  }
}

customElements.define("app-status", AppStatus);
