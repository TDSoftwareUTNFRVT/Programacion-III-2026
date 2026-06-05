
class TriviaAPI {
    static BASE_URL = 'https://opentdb.com';

    async getPreguntas(cantidad, categoria, dificultad) {
        try {
            let url = TriviaAPI.BASE_URL + '/api.php?amount=' + cantidad + '&type=multiple';
            if (categoria) url += '&category=' + categoria;
            if (dificultad) url += '&difficulty=' + dificultad;

            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error('Error en la API');

            const data = await respuesta.json();
            return data.results;

        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getCategorias() {
        try {
            const respuesta = await fetch(TriviaAPI.BASE_URL + '/api_category.php');
            if (!respuesta.ok) throw new Error('Error al obtener categorÃ­as');

            const data = await respuesta.json();
            return data.trivia_categories;

        } catch (error) {
            console.error(error);
            return [];
        }
    }
}