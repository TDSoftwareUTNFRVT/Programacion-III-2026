import { BookService } from "./services/BookService.js";
import { SearchBar } from "./components/SearchBar.js";
import { BookCardElement } from "./components/BookCardElement.js";
import { tryCatch } from "./utils/helpers.js";
import "./components/AppStatus.js";
import "./components/BookDetail.js";
const state = {
    query: "",
    books: [],
    isLoading: false,
    error: null,
    totalResults: 0,
};
const grid = document.getElementById("results-grid");
const status = document.getElementById("app-status");
async function handleSearch(query) {
    state.query = query;
    state.isLoading = true;
    state.error = null;
    updateStatus("loading");
    clearGrid();
    const [books, error] = await tryCatch(() => BookService.getInstance().searchBooks(query));
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
function renderBooks(books) {
    books.forEach((book) => {
        const card = new BookCardElement();
        card.setBook(book);
        grid.appendChild(card);
    });
}
function updateStatus(st, msg) {
    status.setAttribute("state", st);
    if (msg)
        status.setAttribute("message", msg);
}
function clearGrid() {
    grid.innerHTML = "";
}
new SearchBar("search-container", {
    placeholder: "Buscar libros, autores...",
    minLength: 3,
    debounceMs: 400,
}, handleSearch);
const detail = document.getElementById("book-detail");
document.addEventListener("book:selected", (e) => {
    console.log("evento recibido", e);
    const event = e;
    detail.show(event.detail);
});
