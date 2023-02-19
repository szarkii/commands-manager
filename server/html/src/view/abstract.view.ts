import { QueryElementService } from '../services/query-element.service';

export abstract class AbstractView {
    protected constructor(protected readonly queryElementService: QueryElementService) {}
}
