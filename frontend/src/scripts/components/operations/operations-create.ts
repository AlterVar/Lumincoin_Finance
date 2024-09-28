import {AuthUtils} from "../../utils/auth-utils";

export class OperationsCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
<<<<<<< Updated upstream:frontend/src/scripts/components/operations/operations-create.js
=======
            return;
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
        this.operationCategorieSelectOptions = this.operationCategorieSelect.options;
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
        if (this.operationCategorieSelectOptions.length > 0) {
            for (let i = this.operationCategorieSelectOptions.length; i > 0; i--) {
                this.operationCategorieSelectOptions.remove(this.operationCategorieSelect[0]);
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
            let categoryIndex = this.operationCategorieSelectOptions[this.oprationCategorieSelect.selectedIndex].id;
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
>>>>>>> Stashed changes:frontend/src/scripts/components/operations/operations-create.ts
        }
    }
}