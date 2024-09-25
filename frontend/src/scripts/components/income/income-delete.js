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

        this.deleteIncomeCategory(id);
    }

    async deleteIncomeCategory(id) {
        const deleteResult = await RequestUtils.sendRequest('/categories/income/' + id, 'DELETE');
        if (!deleteResult.error) {
            return this.openNewRoute('/income');
        }
    }
}