export default class apiOpenLibrary{
    constructor(){
        // this.api_authors=`https://openlibrary.org/search/authors.json?q=${query}&page;=${page}&limit;=${limit}`
        // this.api_authorsPhoto=`https://covers.openlibrary.org/a/olid/${key}-M.jpg`
        
        
    }
    async getData(inputed_name, selected_limit, selected_page){
        this.selected_page=1
        this.response = await fetch(`https://openlibrary.org/search/authors.json?q=${inputed_name}&page;=${this.selected_page}&limit;=${selected_limit}`)
        this.response = await this.response.json();
        return this.response
    }

    getTotalResults(response){
        this.TotalResults = response.numFound;
        return this.TotalResults
    }
    getAuthorData(response, author_index){
        this.author_data = response.docs[author_index];
        return this.author_data
    }
    getAuthorName(author_data){
        this.author_name = author_data.name;
        return this.author_name
    }
    getAuthorKey(author_data){
        this.author_key = author_data.key;
        return this.author_key
    }
    getAuthorTopWork(author_data){
        this.author_top_work = author_data.top_work;
        return this.author_top_work
    }
    getAuthorBirthDate(author_data){
        this.author_birth_date = author_data.birth_date;
        return this.author_birth_date
    }
    async getAuthorPhoto(author_data, author_key){
        this.author_photo = await fetch(`https://covers.openlibrary.org/a/olid/${author_key}-M.jpg`)
        this.author_photo = this.author_photo.url
        return this.author_photo
        
    }
}