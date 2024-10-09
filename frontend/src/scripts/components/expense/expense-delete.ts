import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CategoriesResponseType, OperationsResponseType} from "../../types/response.type";
import {CategoriesService} from "../../services/categories-service";
import {OperationsService} from "../../services/operations-service";
import {OperationsType} from "../../types/operations.type";
import {CategoriesType} from "../../types/categories.type";

export class ExpenseDelete {
    readonly openNewRoute: (route: string) => {};

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (id) {
            this.deleteOperations(id);
        }
    }

    private async deleteOperations(id: string): Promise<void> {
        const categoryResult:CategoriesResponseType = await CategoriesService.deleteCategory('expense', id);
        if (categoryResult.error && categoryResult.redirect) {
            this.openNewRoute(categoryResult.redirect);
            return;
        }
        if (!categoryResult.error) {
            const operationsList: OperationsResponseType = await OperationsService.getOperations('all');
            if (operationsList) {
                if (operationsList.error && operationsList.redirect) {
                    this.openNewRoute(operationsList.redirect);
                    return;
                }
                if (!operationsList.error && !operationsList.redirect && operationsList.operations) {
                    const operationsToDelete: OperationsType[] = (operationsList.operations as OperationsType[]).filter((item: OperationsType) =>
                        item.category === (categoryResult.categories as CategoriesType).title);
                    if (operationsToDelete) {
                        for (let i = 0; i < operationsToDelete.length; i++) {
                            const deleteOperationsResult: OperationsResponseType = await OperationsService.deleteOperations(operationsToDelete[i].id!);
                        }
                    }
                }
            }
        }
        this.openNewRoute('/expense');
        return;
    }
}