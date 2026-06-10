class TriviaAPI {
  static BASE_URL = 'https://opentdb.com';

  async getPreguntas(cantidad = 10, categoria = '', dificultad = '') {
    const params = new URLSearchParams({ amount: cantidad, type: 'multiple' });
    if (categoria) params.append('category', categoria);
    if (dificultad) params.append('difficulty', dificultad);

    const url = `${TriviaAPI.BASE_URL}/api.php?${params}`;

    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

    const datos = await respuesta.json();

    if (datos.response_code !== 0) {
      const errores = { 1: 'No hay preguntas con esos filtros.', 5: 'Demasiadas solicitudes.' };
      throw new Error(errores[datos.response_code] || `Código de error: ${datos.response_code}`);
    }

    return datos.results;
  }

  async getCategorias() {
    const url = `${TriviaAPI.BASE_URL}/api_category.php`;
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('No se pudieron cargar las categorías.');

    const datos = await respuesta.json();
    return datos.trivia_categories || [];
  }
}