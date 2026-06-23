import { Book } from "../models/Book.js";
import { truncate, joinList } from "../utils/helpers.js";

export class BookCardElement extends HTMLElement {
  private shadow: ShadowRoot;
  private _book: Book | null = null;

  static get observedAttributes(): string[] {
    return ["data-title", "data-cover"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    if (!this._book) {
    this.renderSkeleton();
    }
  }

  attributeChangedCallback(name: string, _old: string, newVal: string): void {
    if (name === "data-title") {
      const h3 = this.shadow.querySelector("h3");
      if (h3) h3.textContent = newVal;
    }
  }

  public setBook(book: Book): void {
    this._book = book;
    this.render();
  }

  private renderSkeleton(): void {
    this.shadow.innerHTML = `
      <style>
        .skeleton {
          background: #3c3836;
          border-radius: 8px;
          height: 280px;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      </style>
      <div class="skeleton"></div>`;
  }

  private render(): void {
    if (!this._book) return;
    const book = this._book;

    const stars = book.rating
      ? "★".repeat(Math.round(book.rating)) + "☆".repeat(5 - Math.round(book.rating))
      : null;

    this.shadow.innerHTML = `
      <style>
        .nf {
          font-family: "NerdIcons";
          font-style: normal;
          font-weight: normal;
        }
        :host {
          display: block;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #504945;
          box-shadow: 0 2px 8px rgba(0,0,0,.4);
          transition: transform .2s;
          cursor: pointer;
          font-family: sans-serif;
          background: #3c3836;
        }
        :host(:hover) { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,.55); border-color: #fe8019; }
        .cover img { width: 100%; height: 200px; object-fit: cover; display: block; }
        .cover .no-cover {
          width: 100%; height: 200px; background: #504945;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; color: #a89984;
        }
        .info { padding: 12px; }
        h3 { margin: 0 0 6px; font-size: .95rem; color: #fbf1c7; }
        .authors { font-size: .82rem; color: #bdae93; margin: 0 0 4px; display: flex; align-items: center; gap: 4px; }
        .year { font-size: .8rem; color: #a89984; margin: 0 0 6px; display: flex; align-items: center; gap: 4px; }
        .rating { font-size: .8rem; color: #fabd2f; margin: 0 0 6px; }
        .badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
        .badge {
          background: #504945; color: #8ec07c;
          border-radius: 99px; font-size: .7rem; padding: 2px 8px;
        }
      </style>
      <div class="cover">
        ${book.coverUrl
          ? `<img src="${book.coverUrl}" alt="${book.title}" loading="lazy" />`
          : `<div class="no-cover"><span class="nf">\uf002</span></div>`}
      </div>
      <div class="info">
        <h3>${truncate(book.title, 55)}</h3>
        <p class="authors"><span class="nf">\uee75</span>${joinList(book.authors, 2)}</p>
        <p class="year"><span class="nf">\ueab0</span>${book.year ?? "Año desconocido"}${book.pages ? ` · ${book.pages} págs.` : ""}</p>
        ${stars ? `<p class="rating">${stars}</p>` : ""}
        <div class="badges">
          ${book.subjects.slice(0, 3).map((s) => `<span class="badge">${s}</span>`).join("")}
        </div>
      </div>`;

    this.shadow.host.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("book:selected", {
          detail: this._book,
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define("book-card", BookCardElement);