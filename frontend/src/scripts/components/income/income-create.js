import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.incomeCreateButton = document.getElementById('create-income');
        this.incomeTitleElement = document.getElementById('income-title');
        this.incomeCreateButton.addEventListener('click', this.createIncome.bind(this));
    }

    async createIncome() {
        if (this.incomeTitleElement) {
            const createIncomeResult = await RequestUtils.sendRequest('/categories/income', 'POST', true, {
                title: this.incomeTitleElement.value
            })

            if (!createIncomeResult.error) {
                this.openNewRoute('/income');
            }
        }
    }
}