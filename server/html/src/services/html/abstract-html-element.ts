import { sortedUniq } from "lodash-es";

export interface HtmlOptions {
    content?: string
}

export abstract class AbstractHtmlElement<T extends HTMLElement> {
    protected element: T;

    constructor(tagName: string, options: HtmlOptions = {}) {
        this.element = document.createElement(tagName) as T;
        if (options.content) {
            this.element.innerText = options.content;
        }
    }

    public get htmlElement(): T {
        return this.element;
    }

    public addClass(className: string) {
        this.addClasses([className]);
    }

    public addClasses(classes: string[]) {
        this.element.className = sortedUniq(
            this.element.className.split(" ").concat(classes))
            .join(" ");
    }
}