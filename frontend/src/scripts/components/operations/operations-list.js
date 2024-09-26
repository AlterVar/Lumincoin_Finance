import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {DateUtils} from "../../utils/date-utils";
import {FilterUtils} from "../../utils/filter-utils";
import Datepicker from "../../datepicker";
import {OperationsService} from "../../services/operations-service";


export class OperationsList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.findElements();
        this.init()

        for (let i = 0; i < this.filterButtonArray.length; i++) {
            const that = this;
            const button = this.filterButtonArray[i];
            button.addEventListener('click', async function () {
                const operationsResponse = await OperationsService.getOperations(FilterUtils.activateFilter(button));
                if (operationsResponse.redirect) {
                    return that.openNewRoute(operationsResponse.redirect);
                }
                that.createTable(operationsResponse.operations);
            });
        }
    }

    findElements() {
        this.filterButtonArray = document.querySelectorAll('.filter-btn');
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');
        this.operationDeleteButton = document.getElementById('delete-operation-btn');
    }

    async init () {
        this.operationDeleteButton.addEventListener('click', this.deleteRedirect.bind(this));

        this.activateDatePickers(this.intervalFromElement, this.intervalToElement);
        const operationsResponse = await OperationsService.getOperations(FilterUtils.activateFilter(this.filterButtonArray[0]));
        if (operationsResponse.redirect) {
            return this.openNewRoute(operationsResponse.redirect);
        }
        this.createTable(operationsResponse.operations);
    }

    activateDatePickers (fromElement, toElement) {
        const that = this;
        const intervalElement = document.getElementById('interval-filter');

        //TODO: убрать активацию функции при загрузке страницы
        new Datepicker(fromElement, {
            onChange: async function () {
                DateUtils.getDateFromPicker(fromElement, null);
                const operationsResponse = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement));
                if (operationsResponse && operationsResponse.redirect) {
                    return that.openNewRoute(operationsResponse.redirect);
                }
                if (operationsResponse && !operationsResponse.redirect && !operationsResponse.error) {
                    that.createTable(operationsResponse.operations);
                }
            }
        });

        new Datepicker(toElement, {
            onChange: async function () {
                DateUtils.getDateFromPicker(null, toElement);
                const operationsResponse = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement));
                if (operationsResponse && operationsResponse.redirect) {
                    return that.openNewRoute(operationsResponse.redirect);
                }
                if (operationsResponse && !operationsResponse.redirect && !operationsResponse.error) {
                    that.createTable(operationsResponse.operations);
                }

            }
        });
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
                    window.location.hesh = "#" + this.id;
            });
        }
    }

    deleteRedirect() {
        const id = window.location.hesh.substring(1);
        this.openNewRoute('operations/delete?id=' + id);
    }
}