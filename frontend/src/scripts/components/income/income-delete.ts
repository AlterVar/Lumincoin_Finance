import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesResponseType, OperationsResponseType} from "../../types/response.type";
import {OperationsService} from "../../services/operations-service";
import {OperationsType} from "../../types/operations.type";
import {CategoriesType} from "../../types/categories.type";

export class IncomeDelete {
    readonly openNewRoute: (route: string) => {};

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            this.deleteOperations(id);
        }
    }

    private async deleteOperations(id: string): Promise<void> {
        const categoryResult:CategoriesResponseType = await CategoriesService.getCategories('income');
        if (categoryResult.error && categoryResult.redirect) {
            this.openNewRoute(categoryResult.redirect);
            return;
        }
        if (categoryResult.categories as CategoriesType[]) {
            const category: CategoriesType = <CategoriesType>(categoryResult.categories as CategoriesType[]).find(item => item.id === parseInt(id));
            const title: string = category.title;

            const operationsList: OperationsResponseType = await OperationsService.getOperations('all');
            if (operationsList) {
                if (operationsList.error && operationsList.redirect) {
                    this.openNewRoute(operationsList.redirect);
                    return;
                }
                if (!operationsList.error && !operationsList.redirect && operationsList.operations) {
                    const operationsToDelete: OperationsType[] = (operationsList.operations as OperationsType[]).filter((item: OperationsType) =>
                        item.category === title);
                    if (operationsToDelete && operationsToDelete.length > 0) {
                        for (let i = 0; i < operationsToDelete.length; i++) {
                            const deleteOperationsResult: OperationsResponseType = await OperationsService.deleteOperations(operationsToDelete[i].id!);
                            if (deleteOperationsResult.error && deleteOperationsResult.redirect) {
                                this.openNewRoute(deleteOperationsResult.redirect);
                                return;
                            }
                        }
                    }
                }
            }
        }
        this.deleteCategory(id);
    }

    async deleteCategory (id:string) {
        const deleteCategoryResult:CategoriesResponseType = await CategoriesService.deleteCategory('income', id);
        if (deleteCategoryResult && !deleteCategoryResult.error) {
            this.openNewRoute('/income');
            return;
        }
    }
}