
class TriviaAPI {
  static BASE_URL = 'https://opentdb.com';

  async getPreguntas(cantidad = 10, categoria = '', dificultad = '') {
    let url = `${TriviaAPI.BASE_URL}/api.php?amount=${cantidad}&type=multiple`;

    if (categoria) {
      url += `&category=${categoria}`;
    }
    if (dificultad) {
      url += `&difficulty=${dificultad}`;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error('La API no pudo devolver preguntas. Intentá de nuevo.');
      }

      return data.results;

    } catch (error) {
      throw error;
    }
  }

  async getCategorias() {
    try {
      const response = await fetch(`${TriviaAPI.BASE_URL}/api_category.php`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.trivia_categories;

    } catch (error) {
      throw error;
    }
  }
}
