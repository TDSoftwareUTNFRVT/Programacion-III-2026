// src/services/BaseService.ts
/**
* Clase abstracta base para todos los servicios de API.
* No puede instanciarse directamente; solo puede heredarse.
*/
export abstract class BaseService {
    protected readonly baseUrl: string; // Solo accesible en subclases
    private readonly timeout: number;
    constructor(baseUrl: string, timeout: number = 5000) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }
    /**
    * Método protegido: las subclases pueden llamarlo, afuera no.
    * Construye la URL final con query params.
    */
    protected buildUrl(endpoint: string, params: Record<string, string>): string {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        Object.entries(params).forEach(([key, val]) => {
            url.searchParams.append(key, val);
        });
        return url.toString();
    }
    /**
    * Método abstracto: CADA subclase DEBE implementarlo.
    * Permite hacer fetch y retorna los datos tipados con <T>.
    */
    protected abstract fetchData<T>(endpoint: string): Promise<T>;
    /** Retorna el estado del servicio (para debugging) */
    public getStatus(): string {
        return `Conectado a: ${this.baseUrl} (timeout: ${this.timeout}ms)`;
    }
}