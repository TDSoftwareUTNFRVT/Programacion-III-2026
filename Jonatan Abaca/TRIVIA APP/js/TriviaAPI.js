// Abaca Jonatan - Brazzar Florencia — TP Trivia App — Programación III

class TriviaAPI {

  static BASE_URL = 'https://opentdb.com';

  async getPreguntas(cantidad = 10, categoria = '', dificultad = '') {

    try {
      
      let url = `${TriviaAPI.BASE_URL}/api.php?amount=${cantidad}&type=multiple`;

      if (categoria)  url += `&category=${categoria}`;
      if (dificultad) url += `&difficulty=${dificultad}`;

  
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      return data.results;

    } catch (error) {

      throw error;
    }
  }

  async getCategorias() {

    try {
      const response = await fetch(`${TriviaAPI.BASE_URL}/api_category.php`);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

    
      return data.trivia_categories;

    } catch (error) {
      throw error;
    }
  }

}