class TriviaAPI {
  static BASE = 'https://opentdb.com';

  async getCategorias() {
    const res = await fetch(`${TriviaAPI.BASE}/api_category.php`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    const data = await res.json();
    return data.trivia_categories;
  }

  async getPreguntas(cantidad = 10, categoria = '', dificultad = '') {
    let url = `${TriviaAPI.BASE}/api.php?amount=${cantidad}&type=multiple`;
    if (categoria)  url += `&category=${categoria}`;
    if (dificultad) url += `&difficulty=${dificultad}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener preguntas');
    const data = await res.json();

    if (data.response_code === 1) throw new Error('No hay suficientes preguntas para esa selección');
    if (data.response_code !== 0) throw new Error('Error en la API de trivia');

    return data.results;
  }
}
