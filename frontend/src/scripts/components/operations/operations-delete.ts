import {OperationsService} from "../../services/operations-service";
import {OperationsType} from "../../types/operations.type";
import {CategoriesType} from "../../types/categories.type";
import {OperationsResponseType} from "../../types/response.type";

export class OperationsDelete {
    readonly openNewRoute: (route: string) => {};

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            this.openNewRoute('/operations');
            return;
        }

        this.deleteOperation(id);
    }

    private async deleteOperation(id: string): Promise<void> {
        const deleteResult: OperationsResponseType = await OperationsService.deleteOperations(id);
        if (deleteResult.error) {
            if (deleteResult.redirect) {
                this.openNewRoute(deleteResult.redirect);
                return;
            }
        }
        if (deleteResult.operations as OperationsType) {
            this.openNewRoute('/income');
            return;
        }
    }
}