import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class ExpenseDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        this.deleteExpenseCategory(id);
    }

    async deleteExpenseCategory(id) {
        const deleteResult = await RequestUtils.sendRequest('/categories/expense/' + id, 'DELETE');
        if (!deleteResult.error) {
            return this.openNewRoute('/expense');
        }
    }
}