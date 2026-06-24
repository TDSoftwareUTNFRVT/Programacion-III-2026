// src/services/BaseService.ts
/**
* Clase abstracta base para todos los servicios de API.
* No puede instanciarse directamente; solo puede heredarse.
*/
export class BaseService {
    constructor(baseUrl, timeout = 5000) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }
    /**
    * Método protegido: las subclases pueden llamarlo, afuera no.
    * Construye la URL final con query params.
    */
    buildUrl(endpoint, params) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        Object.entries(params).forEach(([key, val]) => {
            url.searchParams.append(key, val);
        });
        return url.toString();
    }
    /** Retorna el estado del servicio (para debugging) */
    getStatus() {
        return `Conectado a: ${this.baseUrl} (timeout: ${this.timeout}ms)`;
    }
}
