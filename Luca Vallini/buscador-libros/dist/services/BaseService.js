export class BaseService {
    constructor(baseUrl, timeout = 500) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }
    buildUrl(endpoint, params) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        Object.entries(params).forEach(([key, val]) => {
            url.searchParams.append(key, val);
        });
        return url.toString();
    }
    getStatus() {
        return `Conectado a: ${this.baseUrl} (timeout: ${this.timeout}ms)`;
    }
}
