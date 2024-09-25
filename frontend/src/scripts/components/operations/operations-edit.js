import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";

export class OperationsEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.findElements();
        const that = this;
        this.operationTypeSelect.onchange = function() {
            const typeIndex = that.operationTypeSelect.selectedIndex;
            that.getCategories(that.operationTypeSelectOptions[typeIndex].value);
        }
        this.getOperationInfo(this.operationId);
    }

    findElements() {
        this.operationTypeSelect = document.getElementById('operation-type');
        this.operationTypeSelectOptions = this.operationTypeSelect.options;
        this.operationCategorieSelect = document.getElementById('operation-category');
        this.amountInputElement = document.getElementById('operation-amount');
        this.dateInputElement = document.getElementById('operation-date');
        this.commentInputElement = document.getElementById('operation-comment');
        this.editOperationButton = document.getElementById('edit-operation');

        this.urlParams = new URLSearchParams(window.location.search);
        this.operationId = this.urlParams.get('id');
        this.editOperationButton.addEventListener('click', this.editOperation.bind(this));
    }

    async getOperationInfo(id) {
        const that = this;
        this.operationInfoResult = await RequestUtils.sendRequest('/operations/' + id);
        if (!this.operationInfoResult.error) {
            that.setOperationType();
            await that.getCategories(this.operationInfoResult.response.type);
        }
    }

    setOperationType() {
        const that = this;
        for (let i = 0; i < this.operationTypeSelectOptions.length; i++) {
            if (this.operationTypeSelectOptions[i].value === this.operationInfoResult.response.type) {
                that.operationTypeSelect.selectedIndex = i;
            }
        }
    }

    async getCategories(type) {
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

        this.fillTable(this.operationInfoResult.response)
    }

    async fillTable(operationData) {
        this.amountInputElement.value = operationData.amount;
        this.dateInputElement.value = operationData.date;
        this.commentInputElement.value = operationData.comment;
    }

    async editOperation () {
        let categoryIndex = this.operationCategorieSelect.options.selectedIndex;
        let createResult = await RequestUtils.sendRequest('/operations/' + this.operationId, 'PUT', true, {
            type: this.operationTypeSelectOptions[this.operationTypeSelect.selectedIndex].value,
            amount: this.amountInputElement.value,
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: categoryIndex + 1
        });

        if(!createResult.error) {
            this.openNewRoute('/operations');
        }
    }
}