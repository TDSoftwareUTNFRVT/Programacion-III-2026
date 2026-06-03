export default class TriviaAPI {
    static BASE_URL = 'https://opentdb.com'

    async fetchSeguro(url) {

        try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw new Error("Error de conexión al servidor.");

    }
    }
    
    async getPreguntas(cantidad = 10, categoria, dificultad) {
        let url = `${TriviaAPI.BASE_URL}/api.php?amount=${cantidad}&type=multiple`;
        if (categoria) {
            url = `${url}&category=${categoria}`;
        }
        if (dificultad) {
            url = `${url}&difficulty=${dificultad}`;
        }
        try {
            const data = await this.fetchSeguro(url);
            if (data.response_code !== 0) { throw new Error("No fue posible obtener las preguntas") }
            return data.results;

        } catch (error) {
            throw error;
        }
    }

    async getCategorias() {
        const url = `${TriviaAPI.BASE_URL}/api_category.php`;
        try{
            const data = await this.fetchSeguro(url);
            return data.trivia_categories;
        } catch (error) {
            throw new Error("No fue posible traer categorías")
        }
    }
}