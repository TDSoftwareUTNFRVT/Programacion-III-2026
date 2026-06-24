// src/utils/helpers.ts
/** Trunca texto a una cantidad máxima de caracteres */
export function truncate(text, maxLength = 100) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength).trimEnd() + "...";
}
/** Formatea un array de strings en lista legible */
export function joinList(items, max = 3) {
    if (items.length === 0)
        return "Sin información";
    const visible = items.slice(0, max);
    const remaining = items.length - max;
    const base = visible.join(", ");
    return remaining > 0 ? `${base} y ${remaining} más` : base;
}
/**
* Función genérica: ejecuta una función async y captura errores.
* Retorna una tupla [data, error] — patrón "Go-style error handling".
*/
export async function tryCatch(fn) {
    try {
        const data = await fn();
        return [data, null];
    }
    catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return [null, error];
    }
}
/** Verifica si una URL de imagen es accesible */
export function getCoverUrl(coverId) {
    if (!coverId)
        return "/public/no-cover.png";
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}
