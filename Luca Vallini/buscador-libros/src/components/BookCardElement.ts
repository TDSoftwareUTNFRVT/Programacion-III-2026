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
        if (this._book) {
            this.render();
        } else {
            this.renderSkeleton();
        }
        this.addEventListener("click", () => {
            if (!this._book) return;
            this.dispatchEvent(new CustomEvent("book:selected", {
                detail: this._book,
                bubbles: true,
                composed: true
            }));
        });
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
                background: #e2e8f0;
                border-radius: 8px;
                height: 280px;
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0%,100% { opacity: 1; }
                50% { opacity: .5; }
            }
        </style>
        <div class="skeleton"></div>
        `;
    }

    private render(): void {
        if (!this._book) return;
        const book = this._book;
        this.shadow.innerHTML = `
        <style>
            :host {
                display: block;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,.12);
                transition: transform .2s;
                cursor: pointer;
                font-family: sans-serif;
            }
            :host(:hover) { transform: translateY(-4px); }
            .cover img {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }
            .info { padding: 12px; }
            h3 { margin: 0 0 6px; font-size: .95rem; color: #1e293b; }
            .authors { font-size: .82rem; color: #64748b; margin: 0 0 4px; }
            .year { font-size: .8rem; color: #94a3b8; margin: 0; }
            .badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
            .badge { background: #ede9fe; color: #6d28d9; border-radius: 99px; font-size: .7rem; padding: 2px 8px; }
        </style>
        <div class="cover">
            <img src="${book.coverUrl ?? "/img/no-cover.png"}" alt="${book.title}" loading="lazy" />
        </div>
        <div class="info">
            <h3>${truncate(book.title, 55)}</h3>
            <p class="authors">${joinList(book.authors, 2)}</p>
            <p class="year">${book.year ?? "Año desconocido"}</p>
            <div class="badges">
                ${book.subjects.slice(0, 3).map(s => `<span class="badge">${s}</span>`).join("")}
            </div>
        </div>
        `;
    }
}

customElements.define("book-card", BookCardElement);