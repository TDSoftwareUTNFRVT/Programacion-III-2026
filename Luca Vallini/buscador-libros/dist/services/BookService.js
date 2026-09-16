import { BaseService } from "./BaseService.js";
export class BookService extends BaseService {
    constructor() {
        super("https://openlibrary.org", 8000);
    }
    static getInstance() {
        if (!BookService.instance) {
            BookService.instance = new BookService();
        }
        return BookService.instance;
    }
    async fetchData(endpoint) {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    async searchBooks(query, limit = 10) {
        const url = this.buildUrl("/search.json", {
            q: query,
            limit: limit.toString(),
            fields: "key,title,author_name,first_publish_year, cover_i,subject"
        });
        const data = await this.fetchData(url);
        return data.docs.map(doc => this.mapToBook(doc));
    }
    mapToBook(doc) {
        return {
            id: doc.key,
            title: doc.title,
            authors: doc.author_name ?? ["Autor desconocido"],
            year: doc.first_publish_year ?? null,
            coverUrl: doc.cover_i
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                : null,
            subjects: doc.subject?.slice(0, 5) ?? [],
            rating: doc.ratings_average ?? null,
            pages: doc.number_of_pages_median ?? null
        };
    }
    async getBooksByAuthor(authorName) {
        const url = this.buildUrl("/search.json", {
            author: authorName
        });
        const data = await this.fetchData(url);
        return data.docs.map(doc => this.mapToBook(doc));
    }
    async searchPage(query, page, pageSize) {
        const url = this.buildUrl("/search.json", {
            q: query,
            limit: pageSize.toString(),
            fields: "key,title,author_name,first_publish_year, cover_i,subject",
            offset: ((page - 1) * pageSize).toString(),
        });
        const data = await this.fetchData(url);
        return {
            books: data.docs.map(doc => this.mapToBook(doc)),
            total: data.numFound
        };
    }
}
