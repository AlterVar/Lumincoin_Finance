import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        this.deleteOperations(id);
    }

    async deleteIncomeCategory(id) {
        const categoryResult = await RequestUtils.sendRequest('/categories/income/' + id, 'DELETE');
        if (categoryResult && !categoryResult.error) {
            return this.openNewRoute('/income');
        }
    }

    async deleteOperations(id) {
        const categoryResult = await RequestUtils.sendRequest('/categories/income/' + id);
        if (!categoryResult.error) {
            const operationsList = await RequestUtils.sendRequest('/operations?period=all');
            if (operationsList && !operationsList.error) {
                const operationsToDelete = operationsList.response.filter(item => item.category === categoryResult.response.title);
                for (let i = 0; i < operationsToDelete.length; i++) {
                    const deleteResult = await RequestUtils.sendRequest('/operations/' + operationsToDelete[i].id, 'DELETE');
                    if (deleteResult.error) {
                        return this.openNewRoute('/income');
                    }
                }
            }
        }
        this.deleteIncomeCategory(id);
    }
}