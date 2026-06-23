import { Book } from "../models/Book";
import { truncate, joinList } from "../utils/helpers";

export class BookCard {
  private book: Book;

  constructor(book: Book) {
    this.book = book;
  }

  public render(): HTMLElement {
    const card = document.createElement("article");
    card.className = "book-card";
    card.setAttribute("data-id", this.book.id);

    card.innerHTML = `
      <div class="book-cover">
        <img src="${this.book.coverUrl ?? "/img/no-cover.png"}"
             alt="${this.escapeHtml(this.book.title)}"
             loading="lazy" />
      </div>
      <div class="book-info">
        <h3>${this.escapeHtml(truncate(this.book.title, 60))}</h3>
        <p class="authors">${joinList(this.book.authors)}</p>
        <p class="year">${this.book.year ?? "Año desconocido"}</p>
        <div class="subjects">${this.renderSubjects()}</div>
      </div>`;

    card.addEventListener("click", () => this.handleClick(card));
    return card;
  }

  private renderSubjects(): string {
    return this.book.subjects
      .slice(0, 3)
      .map((s) => `<span class="badge">${this.escapeHtml(s)}</span>`)
      .join("");
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  private handleClick(card: HTMLElement): void {
    card.dispatchEvent(
      new CustomEvent<Book>("book:selected", {
        detail: this.book,
        bubbles: true,
        composed: true,
      })
    );
  }
}
