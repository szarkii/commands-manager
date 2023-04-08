
export class AbstractRestService {
    protected getApiUrl(rest: string[] | string): string {
        const restParts: string[] = Array.isArray(rest) ? rest : [rest]; 
        return "http://localhost:8080/" + restParts.join("/");
    }
}