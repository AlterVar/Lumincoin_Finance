import {AuthUtils} from "../../utils/auth-utils";
import {OperationsService} from "../../services/operations-service";
import {CategoriesResponseType, OperationsResponseType} from "../../types/response.type";
import {OperationsType} from "../../types/operations.type";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesType} from "../../types/categories.type";
import * as url from "url";

export class OperationsEdit {
    readonly openNewRoute: (route: string) => {};
    private operationTypeSelect: HTMLSelectElement | null = null;
    private operationTypeSelectOptions: HTMLOptionsCollection | null = null;
    private operationCategorySelect: HTMLSelectElement | null = null;
    private operationCategorySelectOptions: HTMLOptionsCollection | null = null;
    private editOperationButton: HTMLElement | null = null;
    private amountInputElement: HTMLInputElement | null = null;
    private dateInputElement: HTMLInputElement | null = null;
    private commentInputElement: HTMLInputElement | null = null;
    private operationInfo: OperationsType | null = null;
    private operationId: string | null = null;
    private errorElement: HTMLElement | null = null;
    
    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.findElements();
        const that = this;
        if (this.operationTypeSelect! && this.operationTypeSelectOptions!) {
            this.operationTypeSelect!.onchange = function() {
                const typeIndex: number = that.operationTypeSelect!.selectedIndex;
                that.getCategories(that.operationTypeSelectOptions![typeIndex].value);
            } 
        }
        
        this.getOperationInfo(this.operationId!);
    }

    findElements() {
        this.operationTypeSelect = <HTMLSelectElement>document.getElementById('operation-type');
        this.operationTypeSelectOptions = this.operationTypeSelect.options;
        this.operationCategorySelect = <HTMLSelectElement>document.getElementById('operation-category');
        this.operationCategorySelectOptions = this.operationCategorySelect.options;
        this.amountInputElement = <HTMLInputElement>document.getElementById('operation-amount');
        this.dateInputElement = <HTMLInputElement>document.getElementById('operation-date');
        this.commentInputElement = <HTMLInputElement>document.getElementById('operation-comment');
        this.editOperationButton = document.getElementById('edit-operation');
        this.errorElement = document.getElementById('error');

        const urlParams: string | null = new URLSearchParams(window.location.search).get('id');
        if (urlParams) {
            this.operationId = urlParams;
        }
        if (this.editOperationButton) {
            this.editOperationButton.addEventListener('click', this.editOperation.bind(this));
        }
    }

    private async getOperationInfo(id: string): Promise<void> {
        const that: OperationsEdit = this;
        const operationInfoResult: OperationsResponseType = await OperationsService.getOperation(id);
        if (operationInfoResult.error) {
            if (operationInfoResult.redirect) {
                this.openNewRoute(operationInfoResult.redirect);
                return;
            }
        } else {
            this.operationInfo = operationInfoResult.operations as OperationsType;
            that.setOperationType();
            await that.getCategories(this.operationInfo.type);
        }
    }

    private setOperationType(): void {
        const that = this;
        if (this.operationTypeSelect && this.operationTypeSelectOptions) {
            for (let i = 0; i < this.operationTypeSelectOptions.length; i++) {
                if (this.operationTypeSelectOptions![i].value === this.operationInfo?.type) {
                    that.operationTypeSelect!.selectedIndex = i;
                }
            }
        }
    }

    private async getCategories(type: string): Promise<void> {
        const categoriesList: CategoriesResponseType = await CategoriesService.getCategories(type);
        if (categoriesList.error) {
            if (categoriesList.redirect) {
                this.openNewRoute(categoriesList.redirect);
                return;
            }
        }
        await this.fillSelects(categoriesList.categories as CategoriesType[]);
    }

    async fillSelects(categories: CategoriesType[]) {
        if (this.operationCategorySelectOptions && this.operationCategorySelectOptions.length > 0) {
            for (let i = this.operationCategorySelectOptions.length; i > 0; i--) {
                this.operationCategorySelectOptions[0].remove();
            }
        }
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                const category: HTMLOptionElement = document.createElement('option');
                category.setAttribute('id', categories[i].id!.toString());
                category.innerText = categories[i].title;

                if (this.operationCategorySelect) {
                    this.operationCategorySelect.appendChild(category);
                }
            }
        }


        const that = this;
        if (this.operationCategorySelectOptions) {
            for (let i = 0; i < this.operationCategorySelectOptions.length; i++) {
                if (this.operationCategorySelectOptions[i].value === this.operationInfo?.category) {
                    that.operationCategorySelect!.selectedIndex = i;
                }
            }
        }

        await this.fillTable(this.operationInfo!);
    }

    private async fillTable(operationData: OperationsType): Promise<void> {
        if (this.amountInputElement && this.dateInputElement && this.commentInputElement) {
            this.amountInputElement.value = operationData.amount.toString();
            this.dateInputElement.value = operationData.date;
            this.commentInputElement.value = operationData.comment;
        }
    }

    private async editOperation (): Promise<void> {
        this.errorElement?.classList.remove('d-block');
        if (this.operationCategorySelectOptions && this.operationTypeSelectOptions) {
            const categoryIndex: number = parseInt(this.operationCategorySelectOptions[<number>this.operationCategorySelect?.selectedIndex].id);

            const updateResult: OperationsResponseType = await OperationsService.updateOperation(this.operationId!, {
                type: this.operationTypeSelectOptions[<number>this.operationTypeSelect?.selectedIndex].value! as string,
                amount: parseInt(this.amountInputElement?.value as string),
                date: this.dateInputElement?.value!,
                comment: this.commentInputElement?.value!,
                category_id: categoryIndex
            });

            if (updateResult && updateResult.operations as string) {
                if (updateResult.operations === "This record already exists") {
                    this.errorElement?.classList.add('d-block');
                }
                if (!updateResult.error && updateResult.operations as OperationsType) {
                    this.openNewRoute('/operations');
                    return;
                }
            }
        }
    }
}