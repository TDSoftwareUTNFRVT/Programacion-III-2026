// src/models/Book.ts
/**
* Representa un libro individual tal como lo devuelve Open Library.
* Usamos "?" para las propiedades que la API puede o no incluir.
*/
export interface BookDoc {
    key: string; // ID único del libro
    title: string; // Título (siempre presente)
    author_name?: string[]; // Array de autores (puede faltar)
    first_publish_year?: number; // Año de primera publicación
    cover_i?: number; // ID de portada para construir URL
    subject?: string[]; // Temas del libro
    isbn?: string[]; // Códigos ISBN
    language?: string[]; // Idiomas disponibles del libro.
    publisher?: string[]; // Editoriales.
    number_of_pages_median?: number; // Promedio de páginas.
    ratings_average?: number; // Puntuación promedio (1–5).
}
/**
* Estructura completa de la respuesta de la API de búsqueda.
* El genérico <T> nos permite reusar esta interface con distintos tipos.
*/
export interface ApiResponse<T> {
    numFound: number; // Total de resultados encontrados
    start: number; // Índice de inicio (para paginación)
    docs: T[]; // Array de resultados del tipo genérico T
}
/**
* Tipo simplificado que usamos internamente en la UI.
* Transformamos los datos crudos de la API a este formato limpio.
*/
export interface Book {
    readonly id: string; // Derivado del campo "key"
    title: string;
    authors: string[]; // Normalizado (nunca undefined)
    year: number | null;
    coverUrl: string | null; // URL completa de la portada
    subjects: string[];
    rating: number | null; // Puntuación promedio (1–5) o null si no hay datos
    pages: number | null; // Número de páginas o null si no hay datos
}
// Podés agregar al final de src/models/Book.ts
/** Opciones de configuración para el componente de búsqueda */
export interface SearchOptions {
    placeholder: string;
    minLength: number; // Mínimo de caracteres para disparar búsqueda
    debounceMs: number; // Milisegundos de espera (debounce)
}
/** Estado de la aplicación */
export interface AppState {
    query: string;
    books: Book[];
    isLoading: boolean;
    error: string | null;
    totalResults: number;
}