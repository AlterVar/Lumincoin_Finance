import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.incomeTitleElement = document.getElementById('income-title');
        this.updateIncomeButton = document.getElementById('update-income');

        const urlParams = new URLSearchParams(window.location.search);
        this.categoryId = urlParams.get('id');

        this.updateIncomeButton.addEventListener('click', this.updateIncomeCategory.bind(this));

        this.loadIncomeCategory();
    }

    async loadIncomeCategory() {
        const incomeCategory = await RequestUtils.sendRequest('/categories/income/' + this.categoryId);
        this.incomeCategoryInfo = incomeCategory.response;
        if (!incomeCategory.error) {
            this.incomeTitleElement.value = incomeCategory.response.title;
        }
    }

    async updateIncomeCategory() {
        if (this.incomeTitleElement.value !== this.incomeCategoryInfo.title) {
            const updateResult = await RequestUtils.sendRequest('/categories/income/' + this.categoryId, 'PUT', true, {
                title: this.incomeTitleElement.value
            });
            if (!updateResult.error) {
                this.openNewRoute('/income');
            }
        }
    }
}