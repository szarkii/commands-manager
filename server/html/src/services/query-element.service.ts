export class QueryElementService {
    constructor() {}

    public getById(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element cannot be found using '${id}' id.`);
        }

        return element;
    }

    public getBySelector(selector: string): Element {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Element cannot be found using '${selector}' id.`);
        }

        return element;
    }

    public getAll(selector: string): HTMLElement[] {
        const elements = document.querySelectorAll(selector);
        if (!elements) {
            throw new Error(`Non element found using '${selector}' selector.`);
        }

        return Array.from(elements) as HTMLElement[];
    }
}
