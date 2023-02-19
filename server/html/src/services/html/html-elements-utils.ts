export class HtmlElementsUtils {
    public static createDiv(): HTMLDivElement {
        return document.createElement("div");
    }

    public static createListItem(content?: string): HTMLLIElement {
        const item = document.createElement("li");
        item.className = "list-group-item"
        item.innerText = content;
        return item;
    }
}