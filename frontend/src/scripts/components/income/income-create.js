import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.incomeCreateButton = document.getElementById('create-income');
        this.incomeTitleElement = document.getElementById('income-title');
        this.errorElement = document.getElementById('category-error');
        this.incomeCreateButton.addEventListener('click', this.createIncome.bind(this));
    }

    async createIncome(e) {
        e.preventDefault();
        if (this.incomeTitleElement.value) {
            this.errorElement.classList.remove('d-block');
            const createIncomeResult = await RequestUtils.sendRequest('/categories/income', 'POST', true, {
                title: this.incomeTitleElement.value
            })
            if (!createIncomeResult.error) {
                return this.openNewRoute('/income');
            }
            if (createIncomeResult.response.message === 'This record already exists') {
                this.errorElement.innerText = 'Такая категория уже существует';
            }
        } else {
            this.errorElement.classList.add('d-block');
        }
    }
}