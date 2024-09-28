import {AuthUtils} from "../../utils/auth-utils";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesResponseType} from "../../types/response.type";
import {CategoriesType} from "../../types/categories.type";

export class ExpenseCreate {
    readonly openNewRoute: (route: string) => {};
    readonly expenseCreateButton: HTMLElement | null;
    private expenseTitleElement: HTMLInputElement | null;
    readonly errorElement: HTMLElement | null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.expenseCreateButton = document.getElementById('create-expense');
        this.expenseTitleElement = <HTMLInputElement>document.getElementById('expense-title');
        this.errorElement = document.getElementById('category-error');
        if (this.expenseCreateButton) {
            this.expenseCreateButton.addEventListener('click', this.createExpense.bind(this));
        }
    }

    private async createExpense(e): Promise<void> {
        e.preventDefault();
        if (this.expenseTitleElement?.value) {
            this.errorElement?.classList.remove('d-block');
            const createExpenseResult: CategoriesResponseType = await CategoriesService.createCategory('expense', {
                title: this.expenseTitleElement.value
            })

            if (createExpenseResult.error) {
                if (createExpenseResult.redirect) {
                    this.openNewRoute(createExpenseResult.redirect);
                    return;
                }
                if (createExpenseResult.categories === 'This record already exists') {
                    if (this.errorElement) {
                        this.errorElement.innerText = 'Такая категория уже существует';
                    }
                }
            }
            if (createExpenseResult.categories as CategoriesType) {
                this.openNewRoute('/expense');
            }
        } else {
            this.errorElement?.classList.add('d-block');
        }
    }
}