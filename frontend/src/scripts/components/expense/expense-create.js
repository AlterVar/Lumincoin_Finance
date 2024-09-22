import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class ExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.expenseCreateButton = document.getElementById('create-expense');
        this.expenseTitleElement = document.getElementById('expense-title');
        this.expenseCreateButton.addEventListener('click', this.createExpense.bind(this));
    }

    async createExpense() {
        if (this.expenseTitleElement) {
            const createExpenseResult = await RequestUtils.sendRequest('/categories/expense', 'POST', true, {
                title: this.expenseTitleElement.value
            })

            if (!createExpenseResult.error) {
                this.openNewRoute('/expense');
            }
        }
    }
}