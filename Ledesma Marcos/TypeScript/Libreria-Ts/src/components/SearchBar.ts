import { SearchOptions } from "../models/Book";

type SearchCallback = (query: string) => void;

export class SearchBar {
  private container: HTMLElement;
  private options: SearchOptions;
  private onSearch: SearchCallback;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    containerId: string,
    options: SearchOptions,
    onSearch: SearchCallback
  ) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Contenedor "${containerId}" no encontrado`);
    this.container = el;
    this.options = options;
    this.onSearch = onSearch;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="search-bar">
        <input type="text" id="search-input"
               placeholder="${this.options.placeholder}"
               minlength="${this.options.minLength}"
               autocomplete="off" />
        <button id="search-btn">Buscar</button>
      </div>`;
    this.attachEvents();
  }

  private attachEvents(): void {
    const input = this.container.querySelector<HTMLInputElement>("#search-input");
    const btn = this.container.querySelector<HTMLButtonElement>("#search-btn");

    input!.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.handleDebounce(target.value);
    });

    btn!.addEventListener("click", () => {
      const query = input!.value.trim();
      if (query.length >= this.options.minLength) this.onSearch(query);
    });

    input!.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const query = input!.value.trim();
        if (query.length >= this.options.minLength) this.onSearch(query);
      }
    });
  }

  private handleDebounce(value: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (value.trim().length >= this.options.minLength) {
        this.onSearch(value.trim());
      }
    }, this.options.debounceMs);
  }
}
