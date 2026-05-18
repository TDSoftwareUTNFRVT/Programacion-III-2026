class TriviaAPI {
  static BASE_URL = 'https://opentdb.com';

  async getPreguntas(cantidad = 10, categoria = '', dificultad = '') {
    try {
        const response = await fetch(`${TriviaAPI.BASE_URL}/api.php?amount=${cantidad}&category=${categoria}&difficulty=${dificultad}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Falló la petición:', error);
        throw error; // Re-throw para que el llamador pueda manejarlo
    }
  }

  async getCategorias() {
    try {
        const response = await fetch(`${TriviaAPI.BASE_URL}/api_category.php`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.trivia_categories;
    } catch (error) {
        console.error('Falló la petición:', error);
        throw error; // Re-throw para que el llamador pueda manejarlo
    }
  }
}

// No olvidar exportar si usan módulos:
// export default TriviaAPI;