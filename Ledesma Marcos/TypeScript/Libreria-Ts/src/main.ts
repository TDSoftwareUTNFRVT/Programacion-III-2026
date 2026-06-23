import { BookService } from "./services/BookService.js";
import { SearchBar } from "./components/SearchBar.js";
import { BookCardElement } from "./components/BookCardElement.js";
import { AppStatus } from "./components/AppStatus.js";
import { BookDetail } from "./components/BookDetail.js";
import { tryCatch } from "./utils/helpers.js";
import { Book, AppState } from "./models/Book.js";

void AppStatus;
void BookDetail;

const state: AppState = {
  query: "",
  books: [],
  isLoading: false,
  error: null,
  totalResults: 0,
};

const grid = document.getElementById("results-grid") as HTMLDivElement;
const status = document.getElementById("app-status") as HTMLElement;
const detail = document.getElementById("book-detail") as HTMLElement & {
  show: (book: Book) => void;
  hide: () => void;
};

async function handleSearch(query: string): Promise<void> {
  state.query = query;
  state.isLoading = true;
  state.error = null;
  updateStatus("loading");
  clearGrid();

  const [books, error] = await tryCatch(() =>
    BookService.getInstance().searchBooks(query)
  );

  state.isLoading = false;

  if (error) {
    state.error = error.message;
    updateStatus("error", error.message);
    return;
  }

  state.books = books ?? [];
  state.totalResults = state.books.length;

  if (state.books.length === 0) {
    updateStatus("empty", `Sin resultados para "${query}"`);
    return;
  }

  updateStatus("idle");
  renderBooks(state.books);
}

function renderBooks(books: Book[]): void {
  books.forEach((book) => {
    const card = new BookCardElement();
    card.setBook(book);
    grid.appendChild(card);
  });
}

function updateStatus(st: string, msg?: string): void {
  status.setAttribute("state", st);
  if (msg) status.setAttribute("message", msg);
}

function clearGrid(): void {
  grid.innerHTML = "";
}

document.addEventListener("book:selected", (e: Event) => {
  const { detail: book } = e as CustomEvent<Book>;
  detail.show(book);
});

new SearchBar(
  "search-container",
  {
    placeholder: "Buscar libros, autores...",
    minLength: 3,
    debounceMs: 400,
  },
  handleSearch
);
