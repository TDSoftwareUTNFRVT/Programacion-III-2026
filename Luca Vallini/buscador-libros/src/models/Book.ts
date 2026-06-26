export interface BookDoc{
    key : string;
    title : string;
    author_name?: string[];
    first_publish_year?:number;
    cover_i?:number;
    subject?:string[];
    isbn?:string[];
    language?: string[];
    publisher?: string[];
    number_of_pages_median?: number;
    ratings_average?: number;
}

export interface ApiResponse<T>{
    numFound:number;
    start:number;
    docs: T[];
}

export interface Book{
    readonly id:string;
    title:string;
    authors:string[];
    year:number | null;
    coverUrl:string | null;
    subjects:string[];
    rating: number | null;
    pages: number | null;
}

export interface SearchOptions{
    placeholder:string;
    minLength:number;
    debounceMs:number;
}

export interface AppState {
    query: string; 
    books: Book[]; 
    isLoading: boolean; 
    error: string | null; 
    totalResults: number; 
}