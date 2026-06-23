import { SearchOptions } from "../models/Book";

export class SearchBar extends HTMLElement {
    private opts: SearchOptions = {
        placeholder: 'Buscar libros...',
        minLength: 3,
        debounceMs: 500,
    };
    private timer: ReturnType<typeof setTimeout> | null = null;

    connectedCallback(): void {
        this.opts = {
            placeholder: this.getAttribute('placeholder') ?? this.opts.placeholder,
            minLength: Number(this.getAttribute('min-length') ?? this.opts.minLength),
            debounceMs: Number(this.getAttribute('debounce-ms') ?? this.opts.debounceMs),
        };
        this.render();
        this.attachListeners();
    }

    private render(): void {
        this.innerHTML = `
            <input type="text"
                   class="search-input"
                   placeholder="${this.opts.placeholder}"
                   aria-label="Buscar libros">
            <button type="button" class="search-btn">Buscar</button>
        `;
    }

    private attachListeners(): void {
        const input = this.querySelector<HTMLInputElement>('.search-input')!;
        const btn = this.querySelector<HTMLButtonElement>('.search-btn')!;

        input.addEventListener('input', () => {
            if (this.timer) clearTimeout(this.timer);
            const q = input.value.trim();
            if (q.length < this.opts.minLength) return;
            this.timer = setTimeout(() => this.emit(q), this.opts.debounceMs);
        });

        input.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key !== 'Enter') return;
            const q = input.value.trim();
            if (q.length >= this.opts.minLength) {
                if (this.timer) clearTimeout(this.timer);
                this.emit(q);
            }
        });

        btn.addEventListener('click', () => {
            const q = input.value.trim();
            if (q.length >= this.opts.minLength) {
                if (this.timer) clearTimeout(this.timer);
                this.emit(q);
            }
        });
    }

    private emit(query: string): void {
        this.dispatchEvent(
            new CustomEvent<{ query: string }>('search', {
                detail: { query },
                bubbles: true,
            })
        );
    }
}

customElements.define('search-bar', SearchBar);
