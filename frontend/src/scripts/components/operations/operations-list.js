import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CommonUtils} from "../../utils/common-utils";
import {DateUtils} from "../../utils/date-utils";
import {FilterUtils} from "../../utils/filter-utils";


export class OperationsList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.filterButtonArray = document.querySelectorAll('.filter-btn');
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');
        this.operationDeleteButton = document.getElementById('delete-operation-btn');

        this.operationDeleteButton.onclick = this.deleteRedirect.bind(this);

        DateUtils.activateDatePickers(this.intervalFromElement, this.intervalToElement);

        for (let i = 0; i < this.filterButtonArray.length; i++) {
            const that = this;
            const button = this.filterButtonArray[i];
            button.addEventListener('click', function () {
                that.getOperations(FilterUtils.activateFilter(button));
            });
        }

        this.getOperations('today');
    }

    async getOperations(filter) {
        const operationsResult = await RequestUtils.sendRequest('/operations?period=' + filter, "GET", true)
        if (operationsResult) {
            this.createTable(operationsResult.response);
        }
    }

    createTable(operations) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';
        for (let i = 0; i < operations.length; i++) {
            let record = operations[i];
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerHTML = CommonUtils.getOperationType(record.type);
            trElement.insertCell().innerText = record.category;
            trElement.insertCell().innerText = record.amount + '$';
            trElement.insertCell().innerText = DateUtils.formatDate(record.date, '-');
            trElement.insertCell().innerText = record.comment;
            trElement.insertCell().innerHTML = CommonUtils.generateTools('operations', record.id);


            recordsElement.appendChild(trElement);
        }

        this.activateDeleteButton();
    }

    activateDeleteButton() {
        this.deleteButtonArray = document.querySelectorAll('.delete');
        for (let i = 0; i < this.deleteButtonArray.length; i++) {
            const button = this.deleteButtonArray[i];
            button.addEventListener('click', function (e) {
                e.preventDefault();
            });
        }
    }

    deleteRedirect(e) {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        this.openNewRoute('operations/delete?id=' + id);
    }
}