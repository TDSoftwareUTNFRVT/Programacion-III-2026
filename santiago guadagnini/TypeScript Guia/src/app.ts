import { BookService } from "./services/BookService";
import { AppState, Book } from "./models/Book";
import { tryCatch } from "./utils/helpers";
import "./components/BookCard";
import "./components/SearchBar";
import { BookCard } from "./components/BookCard";

const PAGE_SIZE = 10;

const state: AppState = {
    query: '',
    books: [],
    isLoading: false,
    error: null,
    totalResults: 0,
};

let currentPage = 1;

const grid       = document.getElementById('books-grid')   as HTMLDivElement;
const pagination = document.getElementById('pagination')    as HTMLDivElement;
const status     = document.getElementById('status')        as HTMLParagraphElement;
const totalEl    = document.getElementById('total')         as HTMLSpanElement;

function renderBooks(books: Book[]): void {
    grid.innerHTML = '';
    if (books.length === 0) {
        grid.innerHTML = '<p class="empty">No se encontraron resultados para esta búsqueda.</p>';
        return;
    }
    for (const book of books) {
        const card = document.createElement('book-card') as BookCard;
        card.book = book;
        grid.appendChild(card);
    }
}

function renderPagination(total: number, page: number): void {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.textContent = '← Anterior';
    prev.className = 'page-btn';
    prev.disabled = page <= 1;
    prev.addEventListener('click', () => doSearch(state.query, page - 1));

    const info = document.createElement('span');
    info.className = 'page-info';
    info.textContent = `Página ${page} de ${totalPages}`;

    const next = document.createElement('button');
    next.textContent = 'Siguiente →';
    next.className = 'page-btn';
    next.disabled = page >= totalPages;
    next.addEventListener('click', () => doSearch(state.query, page + 1));

    pagination.append(prev, info, next);
}

async function doSearch(query: string, page: number): Promise<void> {
    currentPage = page;
    state.isLoading = true;
    state.error = null;

    status.textContent = 'Buscando...';
    status.className = 'status loading';
    grid.innerHTML = '';
    pagination.innerHTML = '';

    const [result, err] = await tryCatch(() =>
        BookService.getInstance().searchPage(query, page, PAGE_SIZE)
    );

    state.isLoading = false;

    if (err || !result) {
        state.error = err?.message ?? 'Error desconocido';
        status.textContent = `Error: ${state.error}`;
        status.className = 'status error';
        return;
    }

    state.books = result.books;
    state.totalResults = result.total;

    status.textContent = '';
    totalEl.textContent = `${result.total.toLocaleString('es-AR')} resultados`;

    renderBooks(result.books);
    renderPagination(result.total, page);
}

document.addEventListener('search', (e: Event) => {
    const { query } = (e as CustomEvent<{ query: string }>).detail;
    if (query === state.query && currentPage === 1) return;
    state.query = query;
    currentPage = 1;
    doSearch(query, 1);
});
