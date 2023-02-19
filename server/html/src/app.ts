import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { GroupsService } from './groups/groups.service';
import { GroupsView } from './groups/groups.view';
import { QueryElementService } from './services/query-element.service';
import { RegisterEventsService } from './services/register-events.service';
import { RestService } from './services/rest.service';

class Application {
    // Private dependencies
    private queryElementService: QueryElementService;
    private registerEventsService: RegisterEventsService;
    private restService: RestService;
    private groupsService: GroupsService;

    // Views
    public groupsView: GroupsView;

    constructor() { }

    public initApplication() {

        // No dependencies
        this.registerEventsService = new RegisterEventsService();
        this.queryElementService = new QueryElementService();
        this.restService = new RestService();

        // Dependencies
        this.groupsService = new GroupsService(this.restService);
        this.groupsView = new GroupsView(this.queryElementService, this.groupsService);

        // Initialization
        this.callOnInitMethods();
        this.registerEventsService.callOnloadEvents();
    }

    private callOnInitMethods() {
        for (let property in this) {
            if (Object.prototype.hasOwnProperty.call(this, property)) {
                if (typeof this[property]["onInit"] === "function") {
                    this[property]["onInit"]();
                }
            }
        }
    }
}

window['app'] = new Application();
