import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class ExpenseEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.expenseTitleElement = document.getElementById('expense-title');
        this.updateIncomeButton = document.getElementById('update-expense');

        const urlParams = new URLSearchParams(window.location.search);
        this.categoryId = urlParams.get('id');

        this.updateIncomeButton.addEventListener('click', this.updateExpenseCategory.bind(this));

        this.loadExpenseCategory();
    }

    async loadExpenseCategory() {
        const expenseCategory = await RequestUtils.sendRequest('/categories/expense/' + this.categoryId);
        this.expenseCategoryInfo = expenseCategory.response;
        if (!expenseCategory.error) {
            this.expenseTitleElement.value = expenseCategory.response.title;
        }
    }

    async updateExpenseCategory() {
        if (this.expenseTitleElement.value !== this.expenseCategoryInfo.title) {
            const updateResult = await RequestUtils.sendRequest('/categories/expense/' + this.categoryId, 'PUT', true, {
                title: this.expenseTitleElement.value
            });
            if (!updateResult.error) {
                this.openNewRoute('/expense');
            }
        }
    }
}