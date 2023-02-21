import { AbstractHtmlElement, HtmlOptions } from "./abstract-html-element";

export class HtmlDivElement extends AbstractHtmlElement<HTMLDivElement> {
    constructor(options?: HtmlOptions) {
        super("div", options);
    }
}