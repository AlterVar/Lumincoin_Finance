import {AuthUtils} from "../../utils/auth-utils";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesResponseType} from "../../types/response.type";
import {CategoriesType} from "../../types/categories.type";

export class ExpenseEdit {
    readonly openNewRoute: (route: string) => {};
    readonly updateExpenseButton: HTMLElement | null = null;
    readonly expenseTitleElement: HTMLInputElement | null = null;
    readonly categoryId: string | null = null;
    private expenseCategoryInfo: CategoriesType | null = null;
    readonly errorElement: HTMLElement | null = null;

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.expenseTitleElement = <HTMLInputElement>document.getElementById('expense-title');
        this.updateExpenseButton = document.getElementById('update-expense');
        this.errorElement = document.getElementById('category-error');

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        this.categoryId = urlParams.get('id');

        if (this.updateExpenseButton) {
            this.updateExpenseButton.addEventListener('click', this.updateExpenseCategory.bind(this));
        }

        this.loadExpenseCategory();
    }

    private async loadExpenseCategory(): Promise<void> {
        if (this.categoryId) {
            const expenseCategory: CategoriesResponseType = await CategoriesService.loadCategory('expense', this.categoryId);
            this.expenseCategoryInfo = expenseCategory.categories as CategoriesType;
            if (expenseCategory.error) {
                if (expenseCategory.redirect) {
                    this.openNewRoute(expenseCategory.redirect);
                    return;
                }
                if (this.expenseTitleElement) {
                    this.expenseTitleElement.value = (expenseCategory.categories as CategoriesType).title;
                }
            }
        }
    }

    private async updateExpenseCategory(): Promise<void> {
        if (this.expenseTitleElement?.value !== this.expenseCategoryInfo!.title) {
            if (this.categoryId) {
                const updateExpenseResult: CategoriesResponseType = await CategoriesService.updateCategory('expense', this.categoryId, {
                    title: this.expenseTitleElement?.value!
                });
                if (updateExpenseResult.error) {
                    if (updateExpenseResult.redirect) {
                        this.openNewRoute(updateExpenseResult.redirect);
                        return;
                    }
                    if (updateExpenseResult.categories === 'This record already exists') {
                        if (this.errorElement) {
                            this.errorElement.innerText = 'Такая категория уже существует';
                        }
                    }
                }
                if (updateExpenseResult.categories as CategoriesType) {
                    this.openNewRoute('/expense');
                    return;
                }
            }
            this.errorElement?.classList.add('d-block');
        }
    }
}