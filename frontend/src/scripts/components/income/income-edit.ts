import {AuthUtils} from "../../utils/auth-utils";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesResponseType} from "../../types/response.type";
import {CategoriesType} from "../../types/categories.type";

export class IncomeEdit {
    readonly openNewRoute: (route: string) => {};
    readonly incomeTitleElement: HTMLInputElement | null = null;
    readonly updateIncomeButton: HTMLElement | null = null;
    readonly categoryId: string | null = null;
    private incomeCategoryInfo: CategoriesType | null = null;
    private errorElement: HTMLElement | null = null;

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.incomeTitleElement = <HTMLInputElement>document.getElementById('income-title');
        this.updateIncomeButton = document.getElementById('update-income');

        const urlParams = new URLSearchParams(window.location.search);
        this.categoryId = urlParams.get('id');

        if (this.updateIncomeButton) {
            this.updateIncomeButton.addEventListener('click', this.updateIncomeCategory.bind(this));
        }
        this.loadIncomeCategory();
    }

    private async loadIncomeCategory(): Promise<void> {
        const incomeCategory: CategoriesResponseType = await CategoriesService.loadCategory('income', this.categoryId!);
        this.incomeCategoryInfo = incomeCategory.categories as CategoriesType;
        if (incomeCategory.error) {
            if (incomeCategory.redirect) {
                this.openNewRoute(incomeCategory.redirect);
                return;
            }
        }
        if (this.incomeTitleElement) {
            this.incomeTitleElement.value = (incomeCategory.categories as CategoriesType).title;
        }
    }

    private async updateIncomeCategory(): Promise<void> {
        if (this.incomeTitleElement?.value !== this.incomeCategoryInfo!.title) {
            if (this.categoryId) {
                const updateIncomeResult: CategoriesResponseType = await CategoriesService.updateCategory('income', this.categoryId, {
                    title: this.incomeTitleElement?.value!
                });
                if (updateIncomeResult.error) {
                    if (updateIncomeResult.redirect) {
                        this.openNewRoute(updateIncomeResult.redirect);
                        return;
                    }
                    if (updateIncomeResult.categories === 'This record already exists') {
                        if (this.errorElement) {
                            this.errorElement.innerText = 'Такая категория уже существует';
                        }
                    }
                }
                if (updateIncomeResult.categories as CategoriesType) {
                    this.openNewRoute('/income');
                    return;
                }
            }
        }
    }
}