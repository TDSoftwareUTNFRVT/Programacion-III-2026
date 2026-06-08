class apiLibros{
async getLibros(query, page, limit){
    let url = `https://openlibrary.org/search.json?q=${query}&page;=${page}&limt;=${limit}`
    try{
    const response = await fetch(url)
     if(!response.ok){
        throw new Error(`error HTTP:${response.status}`)}
        const data = await response.json()
    }catch (error) {
      throw new Error(error.message || 'No se pudo conectar con la API de preguntas.');
    }
    return data
}
async getImagen(cover_i){
    let url_imagen = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`  
    try{
    const response = await fetch(url)
    if(!response.ok){
        throw new Error(`Error HTTP:${response.status}`)
    }
    const data = await response.json() 
    }catch (error) {
      throw new Error(error.message || 'No se pudo conectar con la API de preguntas.');
    }
    return data 
}
}




