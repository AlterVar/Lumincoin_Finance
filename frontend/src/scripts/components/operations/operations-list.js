import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CommonUtils} from "../../utils/common-utils";
import {DateUtils} from "../../utils/date-utils";
import config from "../../config/config";


export class OperationsList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.filterButton = document.querySelectorAll('.filter-btn');
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');


        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        DateUtils.activateDatePickers(this.intervalFromElement, this.intervalToElement);

        for (let i = 0; i < this.filterButton.length; i++) {
            const that = this;
            const button = this.filterButton[i];
            button.addEventListener('click', function () {
                that.activateFilter(button);
            });
        }

        this.getOperations('all');
    }

    async getOperations(filter) {
        const operationsResult = await RequestUtils.sendRequest('/operations?period=' + filter, "GET", true)
        if (operationsResult) {
            this.createTable(operationsResult.response);
        }
        if (operationsResult.redirect) {
            this.openNewRoute('/login');
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
    }

    activateFilter(currentFilter) {
        for (let i = 0; i < this.filterButton.length; i++) {
            this.filterButton[i].classList.remove('active');
        }
        currentFilter.classList.add('active');
        this.chooseFilter(currentFilter);
    }

    chooseFilter(currentFilter) {
        let filterType = CommonUtils.getFilterType(currentFilter.innerText);
        if (filterType === config.filterTypes.interval) {
            const dateFrom = this.intervalFromElement.innerText;
            const dateTo = this.intervalToElement.innerText;
            if (!dateFrom || dateFrom === 'Дата' || !dateTo || dateTo === 'Дата') {
                return;
            }
            filterType += '&&dateFrom=' + DateUtils.formatDate(dateFrom, '.') + '&dateTo=' + DateUtils.formatDate(dateTo, '.');
        }
        if (filterType === config.filterTypes.today) {
            const todayFrom = new Date();
            const dateFrom = (new Intl.DateTimeFormat("ru-RU").format(todayFrom)).toString()
            const todayTo = new Date();
            const dateTo = (new Intl.DateTimeFormat("ru-RU").format(todayTo)).toString()
            filterType = 'interval'+'&&dateFrom=' + DateUtils.formatDate(dateFrom, '.') + '&dateTo=' + DateUtils.formatDate(dateTo, '.');
        }
        this.getOperations(filterType);
    }
}