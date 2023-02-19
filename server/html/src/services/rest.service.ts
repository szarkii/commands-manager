export class RestService {

    constructor() {}

    public async get(url: string): Promise<string> {
        const response = await fetch(url).catch(console.error) as Response;
        return await response.text();
    }
}