// src/main.ts (versión inicial para probar)
import { BookService } from "./services/BookService";
import { tryCatch, joinList } from "./utils/helpers";
async function buscarLibros(query: string): Promise<void> {
    console.log(`Buscando: "${query}"...`);
    // Patrón tryCatch: evita try/catch verboso en cada llamada
    const [books, error] = await tryCatch(() =>
        BookService.getInstance().searchBooks(query, 5)
    );
    // Narrowing: TypeScript sabe que si error != null, books puede ser null
    if (error) {
        console.error("Error al buscar:", error.message);
        return;
    }
    // Aquí TypeScript sabe que books NO es null (narrowing automático)
    if (!books || books.length === 0) {
        console.log("No se encontraron resultados.");
        return;
    }
    books.forEach(book => {
        console.log(`n ${book.title}`);
        console.log(` Autores: ${joinList(book.authors)}`);
        console.log(` Año: ${book.year ?? "Desconocido"}`);
        console.log(` Portada: ${book.coverUrl ?? "Sin portada"}`);
        console.log("---");
    });
}
// Llamada inmediata para probar
buscarLibros("TypeScript programming");