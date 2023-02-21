import { AbstractHtmlElement, HtmlOptions } from "../abstract-html-element";

export abstract class AbstractBootstrapHtmlElement<T extends HTMLElement> extends AbstractHtmlElement<T> {
    constructor(tagName: string, options?: HtmlOptions) {
        super(tagName, options);
    }

    public setLeftPadding(padding: number) {
        // TODO Validate if padding class already added
        this.addClass("ps-" + padding);
    }
}