import { truncate, joinList } from "../utils/helpers";
export class BookCard {
    constructor(book) {
        this.book = book;
    }
    render() {
        this.card = document.createElement("article");
        this.card.className = "book-card";
        this.card.setAttribute("data-id", this.book.id);
        this.card.innerHTML = `
        <div class="book-cover">
            <img src="${this.book.coverUrl ?? "/img/no-cover.png"}" alt="${this.escapeHtml(this.book.title)}" loading="lazy" />
        </div>
        <div class="book-info">
            <h3>${this.escapeHtml(truncate(this.book.title, 60))}</h3>
            <p class="authors">${joinList(this.book.authors)}</p>
            <p class="year">${this.book.year ?? "Año desconocido"}</p>
            <div class="subjects">${this.renderSubjects()}</div>
        </div>
        `;
        this.card.addEventListener("click", () => this.handleClick());
        return this.card;
    }
    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    renderSubjects() {
        return (this.book.subjects ?? [])
            .slice(0, 3)
            .map((subject) => `<span class="badge">${this.escapeHtml(subject)}</span>`)
            .join("");
    }
    handleClick() {
        console.log(`Seleccionado: ${this.book.title}`);
        const event = new CustomEvent("book:selected", {
            detail: this.book,
            bubbles: true
        });
        this.card.dispatchEvent(event);
    }
}
