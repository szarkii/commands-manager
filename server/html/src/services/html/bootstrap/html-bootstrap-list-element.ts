import { HtmlOptions } from "../abstract-html-element";
import { AbstractBootstrapHtmlElement } from "./abstract-html-bootstrap-element";


export class HtmlBootstrapListElement extends AbstractBootstrapHtmlElement<HTMLLIElement> {
    constructor(options?: HtmlOptions) {
        super("li", options);
        this.addClass("list-group-item");
    }
}