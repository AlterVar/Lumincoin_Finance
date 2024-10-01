import {AuthUtils} from "../../utils/auth-utils";
import {InputType} from "../../types/input.type";
import {CategoriesResponseType, OperationsResponseType} from "../../types/response.type";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesType} from "../../types/categories.type";
import {ValidationUtils} from "../../utils/validation-utils";
import {OperationsService} from "../../services/operations-service";
import {OperationsType} from "../../types/operations.type";

export class OperationsCreate {
    readonly openNewRoute: (route: string) => {};
    private operationTypeSelect: HTMLSelectElement | null = null;
    private operationTypeSelectOptions: HTMLOptionsCollection | null = null;
    private operationCategorySelect: HTMLSelectElement | null = null;
    private operationCategorySelectOptions: HTMLOptionsCollection | null = null;
    private createOperationButton: HTMLElement | null = null;
    private amountInputElement: HTMLInputElement | null = null;
    private dateInputElement: HTMLInputElement | null = null;
    private commentInputElement: HTMLInputElement | null = null;
    private errorElement: HTMLElement | null = null;
    private categoriesType: string | null = null;
    private operationArray: InputType[] = [];


    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }
        this.findElements();

        const that = this;
        this.operationTypeSelect!.onchange = function () {
            that.getCategories(that.operationTypeSelect?.selectedIndex!);
        }
        this.createOperationButton!.addEventListener('click', this.createOperation.bind(this));
    }

    private findElements(): void {
        this.operationTypeSelect = <HTMLSelectElement>document.getElementById('operation-type');
        this.operationTypeSelectOptions = this.operationTypeSelect.options;
        this.operationCategorySelect = <HTMLSelectElement>document.getElementById('operation-category');
        this.operationCategorySelectOptions = this.operationCategorySelect.options;
        this.createOperationButton = document.getElementById('create-operation');
        this.amountInputElement = <HTMLInputElement>document.getElementById('operation-amount');
        this.dateInputElement = <HTMLInputElement>document.getElementById('operation-date');
        this.commentInputElement = <HTMLInputElement>document.getElementById('operation-comment');
        this.errorElement = document.getElementById('error');

        this.operationArray = [
            {element: this.amountInputElement},
            {element: this.dateInputElement},
            {element: this.commentInputElement}
        ]

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        this.categoriesType = urlParams.get('type');

        for (let i = 0; i < this.operationTypeSelectOptions.length; i++) {
            if (this.operationTypeSelectOptions[i].value === this.categoriesType) {
                this.operationTypeSelectOptions[i].selected = true;
            }
        }
        this.getCategories(this.operationTypeSelect.selectedIndex);
    }

    private async getCategories(typeIndex: number): Promise<void> {
        if (this.operationTypeSelectOptions) {
            const type: string = this.operationTypeSelectOptions[typeIndex].value;
            const categoriesInfo: CategoriesResponseType = await CategoriesService.getCategories(type);
            if (categoriesInfo.error) {
                if (categoriesInfo.redirect) {
                    this.openNewRoute(categoriesInfo.redirect);
                    return;
                }
            } else if (categoriesInfo.categories as CategoriesType[]) {
                this.fillSelects(categoriesInfo.categories as CategoriesType[]);
            }
        }
    }

    private async fillSelects(categories: CategoriesType[]): Promise<void> {
        if (this.operationCategorySelectOptions && this.operationCategorySelectOptions.length > 0) {
            for (let i = this.operationCategorySelectOptions?.length; i > 0; i--) {
                this.operationCategorySelectOptions[0].remove();
            }
        }
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                let category: HTMLOptionElement = document.createElement('option');
                category.setAttribute('id', categories[i].id!.toString())
                category.innerText = categories[i].title;

                this.operationCategorySelect?.appendChild(category);
            }
        }
    }

    private async createOperation(e: any): Promise<void> {
        e.preventDefault();
        this.errorElement?.classList.remove('d-block');
        if (ValidationUtils.validateForm(this.operationArray)) {
            if (this.operationCategorySelect && this.operationCategorySelectOptions && this.operationTypeSelectOptions) {
                const categoryIndex: number = parseInt(this.operationCategorySelectOptions[this.operationCategorySelect.selectedIndex].id);
                const createResult: OperationsResponseType = await OperationsService.createOperation({
                    type: this.operationTypeSelectOptions[<number>this.operationTypeSelect?.selectedIndex].value!,
                    amount: parseInt(this.amountInputElement?.value as string),
                    date: this.dateInputElement?.value!,
                    comment: this.commentInputElement?.value!,
                    category_id: categoryIndex
                });
                if (createResult && createResult.operations as string) {
                    if (createResult.operations === "This record already exists") {
                        this.errorElement?.classList.add('d-block');
                    }
                    if (!createResult.error && createResult.operations as OperationsType) {
                        this.openNewRoute('/operations');
                        return;
                    }
                }
            }
        }
    }
}