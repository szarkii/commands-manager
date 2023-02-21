import { HtmlOptions } from "../abstract-html-element";
import { AbstractBootstrapHtmlElement } from "./abstract-html-bootstrap-element";


export class HtmlBootstrapLinkListElement extends AbstractBootstrapHtmlElement<HTMLAnchorElement> {
    constructor(options?: HtmlOptions) {
        super("a", options);
        this.addClasses(["list-group-item", "list-group-item-action"]);
    }
}