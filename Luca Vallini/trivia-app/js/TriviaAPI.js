class TriviaApi{
    static BASE_URL = 'https://opentdb.com';
    

    async getPreguntas(cantidad = 10, categoria='', dificultad=''){
        const url = `${TriviaApi.BASE_URL}/api.php?amount=${cantidad}&difficulty=${dificultad}`;
        try{
            const response = await fetch(url)
            if (!response.ok){
                throw new Error('Error en la respuesta');
            }
            const data = await response.json();
            return data.results
        }
        catch(e){
            console.log(e)
            throw new Error('Error con la conexión');
        }
    }

    async getCategorias(){
        const url = `${TriviaApi.BASE_URL}/api_category.php`
        try{
            const response = await fetch(url)
            if (!response.ok){
                throw new Error('Error en la respuesta')
            }
            const data = await response.json()
            return data.trivia_categories
        }

        catch{
            throw new Error('Error con la conexion')
        }
    }
}

export default TriviaApi