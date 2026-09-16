export class SearchBar {
    constructor(containerId, options, onSearch) {
        this.debounceTimer = null;
        const el = document.getElementById(containerId);
        if (!el)
            throw new Error(`Contenedor "${containerId}" no encontrado`);
        this.container = el;
        this.options = options;
        this.onSearch = onSearch;
        this.render();
    }
    render() {
        this.container.innerHTML = `
        <div class="search-bar">
            <input
            type="text"
            id="search-input"
            placeholder="${this.options.placeholder}"
            minlength="${this.options.minLength}"
            autocomplete="off"
            />
            <button id="search-btn">Buscar</button>
        </div>
        `;
        this.attachEvents();
    }
    attachEvents() {
        const input = this.container.querySelector("#search-input");
        const btn = this.container.querySelector("#search-btn");
        input.addEventListener("input", (e) => {
            const target = e.target;
            this.handleDebounce(target.value);
        });
        btn.addEventListener("click", () => {
            const query = input.value.trim();
            if (query.length >= this.options.minLength)
                this.onSearch(query);
        });
    }
    handleDebounce(value) {
        if (this.debounceTimer)
            clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (value.trim().length >= this.options.minLength) {
                this.onSearch(value.trim());
            }
        }, this.options.debounceMs);
    }
}
