// src/services/BookService.ts
import { BaseService } from "./BaseService";
import { ApiResponse, BookDoc, Book } from "../models/Book";
export class BookService extends BaseService {
    private static instance: BookService; // Patrón Singleton
    // Constructor privado: no se puede hacer "new BookService()"
    private constructor() {
        super("https://openlibrary.org", 8000);
    }
    /** Patrón Singleton: siempre devuelve la misma instancia */
    public static getInstance(): BookService {
        if (!BookService.instance) {
            BookService.instance = new BookService();
        }
        return BookService.instance;
    }
    /** Implementación obligatoria del método abstracto */
    protected async fetchData<T>(endpoint: string): Promise<T> {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.json() as Promise<T>;
    }
    /** Busca libros por query y los transforma al modelo interno */
    public async searchBooks(query: string, limit: number = 10): Promise<Book[]> {
        const url = this.buildUrl("/search.json", {
            q: query,
            limit: limit.toString(),
            fields: "key,title,author_name,first_publish_year,cover_i,subject"
        });
        const data = await this.fetchData<ApiResponse<BookDoc>>(url);
        return data.docs.map(doc => this.mapToBook(doc));
    }
    /** Transforma un BookDoc (API) fi Book (modelo interno) */
    private mapToBook(doc: BookDoc): Book {
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

    public async getBooksByAuthor(authorName: string): Promise<Book[]> {
        const url = this.buildUrl("/search.json", {
            author: authorName
        });
        const data = await this.fetchData<ApiResponse<BookDoc>>(url);
        return data.docs.map(doc => this.mapToBook(doc));
    }

    public async searchPage(query: string, page: number, pageSize: number):
        Promise<{ books: Book[], total: number }> {
            const url = this.buildUrl("/search.json", {
                q: query,
                limit: pageSize.toString(),
                offset: ((page - 1) * pageSize).toString()
            });
            const data = await this.fetchData<ApiResponse<BookDoc>>(url);
            return {
                books: data.docs.map(doc => this.mapToBook(doc)),
                total: data.numFound ?? data.docs.length
            };
    }
}