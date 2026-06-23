
export abstract class BaseService {
  protected readonly baseUrl: string;
  private readonly timeout: number;

  constructor(baseUrl: string, timeout: number = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  
  protected buildUrl(endpoint: string, params: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.append(key, val);
    });
    return url.toString();
  }

  protected abstract fetchData<T>(endpoint: string): Promise<T>;

  public getStatus(): string {
    return `Conectado a: ${this.baseUrl} (timeout: ${this.timeout}ms)`;
  }
}
