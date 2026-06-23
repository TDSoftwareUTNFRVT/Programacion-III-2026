import { BookService } from "../services/BookService";
import { tryCatch, joinList } from "../utils/helpers";
import { Book } from "../models/Book";

async function buscarLibros(query: string): Promise <void> {
    console.log(`Buscando libros por: "${query}"...`);

    const [books, error] = await tryCatch(() =>
    BookService.getInstance().searchBooks(query, 5));

    if (error) {
        console.error("Error al buscar:", error.message);
        return;
    }

    if (!books || books.length === 0) {
        console.log("No se encontraron resultados.");
        return;
    }

    books.forEach((book: Book) => {
        console.log(`■ ${book.title}`);
        console.log(` Autores: ${joinList(book.authors)}`);
        console.log(` Año: ${book.year ?? "Desconocido"}`);
        console.log(` Portada: ${book.coverUrl ?? "Sin portada"}`);
        console.log("---");
    });
}

buscarLibros("TypeScript programming");
