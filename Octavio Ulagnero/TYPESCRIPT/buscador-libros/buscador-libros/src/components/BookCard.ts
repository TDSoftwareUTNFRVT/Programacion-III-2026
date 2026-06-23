import { Book } from "../models/Book";
import { truncate, joinList } from "../utils/helpers";

export class BookCard extends HTMLElement {
    private _book: Book | null = null;

    set book(value: Book) {
        this._book = value;
        this.render();
    }

    connectedCallback(): void {
        this.render();
    }

    private render(): void {
        if (!this._book) return;
        const { title, authors, year, coverUrl, subjects } = this._book;

        this.innerHTML = `
            <img class="cover"
                 src="${coverUrl ?? '/no-cover.png'}"
                 alt="Portada de ${this.esc(title)}"
                 onerror="this.src='/no-cover.png'">
            <div class="info">
                <h3 class="book-title" title="${this.esc(title)}">${this.esc(truncate(title, 55))}</h3>
                <p class="authors">${this.esc(joinList(authors))}</p>
                <p class="year">${year ?? 'Año desconocido'}</p>
                ${subjects.length > 0
                    ? `<p class="subjects">${this.esc(joinList(subjects, 3))}</p>`
                    : ''}
            </div>
        `;
    }

    private esc(s: string): string {
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

customElements.define('book-card', BookCard);
