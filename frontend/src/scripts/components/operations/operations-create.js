import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class OperationsCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }
        this.findElements();

        const that = this;
        this.operationTypeSelect.onchange = function () {
            that.getCategories(that.operationTypeSelect.selectedIndex);
        }
        this.createOperationButton.addEventListener('click', this.createOperation.bind(this));
    }

    findElements() {
        this.operationTypeSelect = document.getElementById('operation-type');
        this.operationTypeSelectOptions = this.operationTypeSelect.options;
        this.operationCategorieSelect = document.getElementById('operation-category');
        this.createOperationButton = document.getElementById('create-operation');
        this.amountInputElement = document.getElementById('operation-amount');
        this.dateInputElement = document.getElementById('operation-date');
        this.commentInputElement = document.getElementById('operation-comment');

        this.operationArray = [
            {element: this.amountInputElement},
            {element: this.dateInputElement},
            {element: this.commentInputElement}
        ]

        this.urlParams = new URLSearchParams(window.location.search);
        this.categoriesType = this.urlParams.get('type');

        for (let i = 0; i < this.operationTypeSelectOptions.length; i++) {
            if (this.operationTypeSelectOptions[i].value === this.categoriesType) {
                this.operationTypeSelectOptions[i].selected = true;
            }
        }
        this.getCategories(this.operationTypeSelect.selectedIndex);
    }

    async getCategories(typeIndex) {
        let type = this.operationTypeSelectOptions[typeIndex].value;
        let categoriesList = await RequestUtils.sendRequest('/categories/' + type);
        if (!categoriesList.error) {
            this.fillSelects(categoriesList.response);
        }
    }

    async fillSelects(categories) {
        if (this.operationCategorieSelect.options.length > 0) {
            for (let i = this.operationCategorieSelect.options.length; i > 0; i--) {
                this.operationCategorieSelect.options.remove(this.operationCategorieSelect[0]);
            }
        }


        for (let i = 0; i < categories.length; i++) {
            let category = document.createElement('option');
            category.setAttribute('id', categories[i].id)
            category.innerText = categories[i].title;

            this.operationCategorieSelect.appendChild(category);
        }
    }

    async createOperation(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.operationArray)) {
            let categoryIndex = this.operationCategorieSelect.options.selectedIndex;
            let createResult = await RequestUtils.sendRequest('/operations', 'POST', true, {
                type: this.operationTypeSelectOptions[this.operationTypeSelect.selectedIndex].value,
                amount: this.amountInputElement.value,
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: categoryIndex + 1
            });

            if (!createResult.error) {
                this.openNewRoute('/operations');
            }
        }
    }
}