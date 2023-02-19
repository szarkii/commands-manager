export class RegisterEventsService {
    constructor() {}

    public callOnloadEvents() {
        document.querySelectorAll('[register-onload-event]').forEach((element: HTMLElement) => {
            // @ts-ignore
            new Function(element.getAttribute('onload')).apply();
        });
    }
}
