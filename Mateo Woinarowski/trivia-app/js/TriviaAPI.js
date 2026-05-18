//Mateo Woinarowski
class TriviaAPI {
  static BASE_URL = 'https://opentdb.com';

  async getPreguntas(cantidad = 10, categoria = '', dificultad = '') {
    let url = `${TriviaAPI.BASE_URL}/api.php?amount=${cantidad}&type=multiple`;
    if (categoria)  url += `&category=${categoria}`;
    if (dificultad) url += `&difficulty=${dificultad}`;

    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

      const datos = await respuesta.json();
      if (datos.response_code !== 0) throw new Error('La API no pudo devolver preguntas. Probá con otra categoría o dificultad.');

      return datos.results;
    } catch (error) {
      throw new Error(error.message || 'No se pudo conectar con la API de preguntas.');
    }
  }

  async getCategorias() {
    try {
      const respuesta = await fetch(`${TriviaAPI.BASE_URL}/api_category.php`);
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

      const datos = await respuesta.json();
      return datos.trivia_categories;
    } catch (error) {
      throw new Error('No se pudieron cargar las categorías.');
    }
  }
}
