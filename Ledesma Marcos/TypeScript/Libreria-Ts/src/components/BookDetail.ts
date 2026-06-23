import { Book } from "../models/Book.js";
import { joinList } from "../utils/helpers.js";

export class BookDetail extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback(): void {
    this.shadow.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("overlay") || target.classList.contains("close-btn")) {
        this.hide();
      }
    });

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") this.hide();
    });
  }

  public show(book: Book): void {
    const stars = book.rating
      ? "★".repeat(Math.round(book.rating)) + "☆".repeat(5 - Math.round(book.rating))
      : null;

    const panel = this.shadow.querySelector(".panel");
    const overlay = this.shadow.querySelector(".overlay");

    if (!panel || !overlay) return;

    panel.innerHTML = `
  <button class="close-btn" aria-label="Cerrar">✕</button>

  <div class="detail-cover">
    ${book.coverUrl
        ? `<img src="${book.coverUrl.replace("-M.jpg", "-L.jpg")}" alt="${book.title}" />`
        : `<div class="no-cover"><span class="nf"> </span></div>`}
  </div>

  <div class="detail-info">
    <h2>${book.title}</h2>

    <p class="detail-authors">
      <span class="nf"> </span>
      ${joinList(book.authors, 10)}
    </p>

    ${book.year
        ? `
      <p class="detail-year">
        <span class="nf"> </span>
        Publicado en ${book.year}
      </p>`
        : ""}

    ${stars
        ? `
      <p class="detail-rating">
        ${stars} (${book.rating?.toFixed(1)})
      </p>`
        : ""}

    ${book.pages
        ? `
      <p class="detail-pages">
        <span class="nf"> </span>
        ${book.pages} páginas
      </p>`
        : ""}

    ${book.subjects.length > 0
        ? `
      <div class="detail-subjects">
        <p class="subjects-label">Temas:</p>
        <div class="badges">
          ${book.subjects.map(s => `<span class="badge">${s}</span>`).join("")}
        </div>
      </div>
      `
        : ""}

    <a
      class="ol-link"
      href="https://openlibrary.org${book.id}"
      target="_blank"
      rel="noopener"
    >
      Ver en Open Library →
    </a>
  </div>
`;

    this.shadow.querySelector(".close-btn")?.addEventListener("click", () => this.hide());

    overlay.classList.add("active");
    panel.classList.add("active");
  }

  public hide(): void {
    this.shadow.querySelector(".overlay")?.classList.remove("active");
    this.shadow.querySelector(".panel")?.classList.remove("active");
  }

  private render(): void {
    this.shadow.innerHTML = `
      <style>
        .nf {
          font-family: "NerdIcons";
          font-style: normal;
          font-weight: normal;
        }
        .overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,.65);
          z-index: 100;
          backdrop-filter: blur(2px);
        }
        .overlay.active { display: block; }

        .panel {
          position: fixed;
          top: 0; right: 0;
          width: min(480px, 100vw);
          height: 100vh;
          background: #3c3836;
          color: #ebdbb2;
          z-index: 101;
          overflow-y: auto;
          padding: 2rem;
          box-sizing: border-box;
          transform: translateX(100%);
          transition: transform .3s cubic-bezier(.4,0,.2,1);
        }
        .panel.active {
          transform: translateX(0);
          animation: slideIn .3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        .close-btn {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; font-size: 1.4rem;
          cursor: pointer; color: #bdae93; line-height: 1;
          padding: 4px 8px; border-radius: 4px;
        }
        .close-btn:hover { background: #504945; color: #fbf1c7; }

        .detail-cover img {
          width: 100%; max-height: 300px;
          object-fit: contain; border-radius: 8px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,.5);
        }
        .no-cover {
          width: 100%; height: 200px;
          background: #504945; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 4rem; color: #a89984; margin-bottom: 1.5rem;
        }

        h2 { margin: 0 0 .75rem; font-size: 1.3rem; color: #fbf1c7; line-height: 1.3; }

        .detail-authors { color: #d5c4a1; margin: 0 0 .4rem; font-size: .9rem; }
        .detail-year    { color: #bdae93; margin: 0 0 .4rem; font-size: .85rem; }
        .detail-rating  { color: #fabd2f; margin: 0 0 .4rem; font-size: .9rem; }
        .detail-pages   { color: #bdae93; margin: 0 0 1rem; font-size: .85rem; }

        .subjects-label { font-size: .8rem; color: #a89984; margin: 0 0 .4rem; text-transform: uppercase; letter-spacing: .05em; }
        .badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.5rem; }
        .badge {
          background: #504945; color: #8ec07c;
          border-radius: 99px; font-size: .75rem; padding: 3px 10px;
        }

        .ol-link {
          display: inline-block;
          background: #fe8019; color: #282828;
          padding: .6rem 1.2rem; border-radius: 6px;
          text-decoration: none; font-size: .9rem;
          font-weight: 600;
          transition: background .2s;
        }
        .ol-link:hover { background: #d65d0e; }
      </style>
      <div class="overlay"></div>
      <div class="panel"></div>
    `;
  }
}

customElements.define("book-detail", BookDetail);