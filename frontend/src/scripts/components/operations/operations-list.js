import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CommonUtils} from "../../utils/common-utils";
import {DateUtils} from "../../utils/date-utils";
import config from "../../config/config";
import Datepicker from '../../datepicker.js';


export class OperationsList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.filterButton = document.querySelectorAll('.filter-btn');
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');


        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.activateDatepickers();
        this.getOperations('all');

        //TODO убрать из конструктора
        for (let i = 0; i < this.filterButton.length; i++) {
            let that = this;
            let filterType = null;
            this.filterButton[i].addEventListener('click', function () {
                that.activateFilter(that.filterButton, that.filterButton[i]);
                filterType = CommonUtils.getFilterType(that.filterButton[i].innerText);
                if (filterType === config.filterTypes.interval) {
                    const dateFrom = that.intervalFromElement.innerText;
                    const dateTo = that.intervalToElement.innerText;
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
                that.getOperations(filterType);
            });
        }
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

    activateFilter(filters, currentFilter) {
        for (let i = 0; i < filters.length; i++) {
            filters[i].classList.remove('active');
        }
        currentFilter.classList.add('active');
    }

    //TODO вынести в отдельную утилитку
    activateDatepickers() {
        let that = this
        this.intervalFromDatepicker = new Datepicker(this.intervalFromElement, {
            onChange: this.getDateFromPicker.bind(that)
        });

        this.intervalToDatepicker = new Datepicker(this.intervalToElement, {
            onChange: this.getDateFromPicker.bind(that)
        });
    }

    getDateFromPicker() {
        if (this.intervalFromElement.getAttribute('data-value')) {
            this.intervalFromElement.innerText = this.intervalFromElement.getAttribute('data-value');
        }
        if (this.intervalToElement.getAttribute('data-value')) {
            this.intervalToElement.innerText = this.intervalToElement.getAttribute('data-value');
        }
    }
}