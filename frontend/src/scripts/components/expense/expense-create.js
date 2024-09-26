import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class ExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.expenseCreateButton = document.getElementById('create-expense');
        this.expenseTitleElement = document.getElementById('expense-title');
        this.errorElement = document.getElementById('category-error');
        this.expenseCreateButton.addEventListener('click', this.createExpense.bind(this));
    }

    async createExpense(e) {
        e.preventDefault();
        if (this.expenseTitleElement.value) {
            this.errorElement.classList.remove('d-block');
            const createExpenseResult = await RequestUtils.sendRequest('/categories/expense', 'POST', true, {
                title: this.expenseTitleElement.value
            })

            if (!createExpenseResult.error) {
                this.openNewRoute('/expense');
            }

            if (createExpenseResult.response.message === 'This record already exists') {
                this.errorElement.innerText = 'Такая категория уже существует';
            }
        } else {
            this.errorElement.classList.add('d-block');
        }
    }
}