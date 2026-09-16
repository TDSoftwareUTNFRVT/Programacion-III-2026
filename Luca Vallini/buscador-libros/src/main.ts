import { BookService } from "./services/BookService.js";
import { SearchBar } from "./components/SearchBar.js";
import { BookCardElement } from "./components/BookCardElement.js";
import { tryCatch } from "./utils/helpers.js";
import { Book, AppState } from "./models/Book.js";
import "./components/AppStatus.js";
import "./components/BookDetail.js";
import type { BookDetail } from "./components/BookDetail.js";

const state: AppState = {
	query: "",
	books: [],
	isLoading: false,
	error: null,
	totalResults: 0,
};

const grid = document.getElementById("results-grid") as HTMLDivElement;
const status = document.getElementById("app-status") as HTMLElement;

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
	if (state.books.length === 0) {
		updateStatus("empty", "No se encontraron libros.");
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


new SearchBar(
	"search-container",
	{
		placeholder: "Buscar libros, autores...",
		minLength: 3,
		debounceMs: 400,
	},
	handleSearch
);

const detail = document.getElementById("book-detail") as BookDetail;

document.addEventListener("book:selected", (e: Event) => {
    console.log("evento recibido", e);
    const event = e as CustomEvent<Book>;
    detail.show(event.detail);
});