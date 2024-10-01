import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesType} from "../../types/categories.type";
import {CategoriesResponseType} from "../../types/response.type";

export class IncomeCreate {
    readonly openNewRoute: (route: string) => {};
    readonly incomeCreateButton: HTMLElement | null = null;
    private incomeTitleElement: HTMLInputElement | null = null;
    readonly errorElement: HTMLElement | null = null;

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.incomeCreateButton = document.getElementById('create-income');
        this.incomeTitleElement = <HTMLInputElement>document.getElementById('income-title');
        this.errorElement = document.getElementById('category-error');

        if (this.incomeCreateButton) {
            this.incomeCreateButton.addEventListener('click', this.createIncome.bind(this));
        }
    }

    private async createIncome(e:any): Promise<void> {
        e.preventDefault();
        if (this.incomeTitleElement?.value) {
            this.errorElement?.classList.remove('d-block');
            const createIncomeResult: CategoriesResponseType = await CategoriesService.createCategory('expense', {
                title: this.incomeTitleElement.value!
            })

            if (createIncomeResult.error) {
                if (createIncomeResult.redirect) {
                    this.openNewRoute(createIncomeResult.redirect);
                    return;
                }
                if (createIncomeResult.categories === 'This record already exists') {
                    if (this.errorElement) {
                        this.errorElement.innerText = 'Такая категория уже существует';
                    }
                }
            }
            if (createIncomeResult.categories as CategoriesType) {
                this.openNewRoute('/expense');
                return;
            }
        }
        this.errorElement?.classList.add('d-block');
    }
}