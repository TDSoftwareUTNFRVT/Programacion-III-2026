// ===== Integrantes ===== 
// =    Marcos Ledesma   = 
// =   Agustin Lanthier  = 
// ======================= 
class TriviaAPI {
    static BASE_URL = 'https://opentdb.com';
    constructor() {
        this.cache = new Map();
    }
    async #fetchJSON(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        this.cache.set(url, data);
        return data;
    }

    async getPreguntas(cantidad = 10, categoria = '', dificultad = '', formato = '') {
        let url = `${TriviaAPI.BASE_URL}/api.php?amount=${cantidad}`;
        if (categoria && dificultad && formato) url += `&category=${categoria}&difficulty=${dificultad}&type=${formato}`;
        if (categoria && !dificultad) url += `&category=${categoria}`;
        if (dificultad && !categoria) url += `&difficulty=${dificultad}`;
        if (categoria && dificultad) url += `&category=${categoria}&difficulty=${dificultad}`;

        try {
            const data = await this.#fetchJSON(url);
            return data.results;
        } catch (error) {
            console.error('Falló la petición:', error.message);
            throw error;
        }
    }

    async getCategorias() {
        try {
            const data = await this.#fetchJSON(`${TriviaAPI.BASE_URL}/api_category.php`);
            return data.trivia_categories;
        } catch (error) {
            console.error('Error al cargar categorías:', error.message);
            throw error;
        }
    }
}
export default TriviaAPI;