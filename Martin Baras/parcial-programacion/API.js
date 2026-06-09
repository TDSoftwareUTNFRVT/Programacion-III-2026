export default class apiOpenLibrary{
    constructor(){
        super();
        this.api_authors=`https://openlibrary.org/search/authors.json?q=${query}&page;=${page}&limit;=${limit}`
        // https://openlibrary.org/search/authors.json?q=Joanne-Rowling&page;=1&limit;=5
        this.api_authorsPhoto=`https://covers.openlibrary.org/a/olid/${key}-M.jpg`
        
        
    }
    async getAuthors(inputed_name, selected_page){
        const selected_page=1
        // await fetch(`https://openlibrary.org/search/authors.json?q=${selected_name}&page;=${selected_page}&limit;=${limit}`)
        
        
    }
}