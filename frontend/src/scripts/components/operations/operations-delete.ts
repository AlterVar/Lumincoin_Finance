import {OperationsService} from "../../services/operations-service";
import {ErrorResponseType, OperationsResponseType} from "../../types/response.type";

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
        if (deleteResult.error || (deleteResult.operations && (deleteResult.operations as ErrorResponseType).error)) {
            alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
            return;
        }
        this.openNewRoute('/operations');
        return;
    }
}