import { Book } from "../models/Book.js";
import { joinList } from "../utils/helpers.js";

export class BookDetail extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({mode:"open"})
        this.style.display = "none";
    }

    public show(book: Book): void {
        this.style.display = "block"
        this.shadow.innerHTML=`
        <style>
        :host {
            position: fixed;
            top: 0;
            right: 0;
            width: 350px;
            height: 100%;
            background: white;
            box-shadow: -4px 0 10px rgba(0,0,0,0.2);
            overflow-y: auto;
            z-index: 1000;
        }

        div {
            padding: 1.5rem;
        }

        img {
            width: 100%;
            border-radius: 4px;
        }

        button {
            float: right;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
        </style>

        <div>
            <button id="close"> X </button>
            <img src="${book.coverUrl}">
            <p>${book.title}</p>
            <p>${joinList(book.authors)}</p>
            <p>${book.year}</p>
            <p>${book.subjects.join(", ")}</p>
            <a href="https://openlibrary.org${book.id}">Ver en Open Library</a>
        </div>
        `;
        this.shadow.querySelector("#close")!.addEventListener("click", () => this.hide());
    };
    

    public hide(): void {
        this.style.display = "none";
    }
}

customElements.define("book-detail", BookDetail);