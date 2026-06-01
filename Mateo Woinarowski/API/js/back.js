class ApiPaises {
    static base_url = 'https://restcountries.com/v3.1'

    async buscar_pais (pais_nombre){
        const url = `${ApiPaises.base_url}/name/${pais_nombre}`;
        try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error (`Error HTTP ${response.status}`)
            }
            const data = await response.json();
            return data;   
        
        } catch(error){
            console.error('Fallo la conexion', error.message);
            throw error
        }
    }
}


