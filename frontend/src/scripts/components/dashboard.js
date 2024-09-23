import Chart from 'chart.js/auto'
import {AuthUtils} from "../utils/auth-utils";
import {DateUtils} from "../utils/date-utils";
import {FilterUtils} from "../utils/filter-utils";
import {RequestUtils} from "../utils/request-utils";
import {CommonUtils} from "../utils/common-utils";
import Datepicker from "../datepicker";
import {OperationsService} from "../services/operations-service";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.findElements();
        this.init();

        this.incomeChart = new Chart(
            document.getElementById('income-pie-chart'),
            {
                type: 'pie',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            color: '#052C65',
                            font: {
                                size: 28
                            },
                            text: 'Доходы'
                        },
                        legend: {
                            labels: {
                                boxWidth: 35
                            }
                        }
                    }
                },
                data: []
            }
        );

        this.expenseChart = new Chart(
            document.getElementById('expense-pie-chart'),
            {
                type: 'pie',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Расходы',
                            color: '#052C65',
                            font: {
                                size: 28
                            },
                        },
                        legend: {
                            labels: {
                                boxWidth: 35
                            }
                        }
                    },
                    elements: {
                        point: {
                            rotation: 180
                        }
                    }
                },
                data: []
            }
        );


        const that = this;
        for (let i = 0; i < this.filterButtonArray.length; i++) {
            const button = this.filterButtonArray[i];
            button.addEventListener('click', async function () {
                const operationsResponse = await OperationsService.getOperations(FilterUtils.activateFilter(button));
                if (operationsResponse.redirect) {
                    that.openNewRoute(operationsResponse.redirect);
                }
                that.loadChartsData(operationsResponse.operations);
            });
        }
    }

    findElements() {
        this.filterButtonArray = document.querySelectorAll('.filter-btn');
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');
    }

    async init() {
        const categories = ['income', 'expense'];
        const loadCategories = categories.map(category => RequestUtils.sendRequest('/categories/' + category));

        await Promise.all(loadCategories).then((responses) => {
            responses.forEach(resp => {
                if (resp.error) {
                    console.log(resp.message);
                    return resp.redirect ? this.openNewRoute(resp.redirect) : null;
                }
            })
            this.incomeCategoriesInfo = responses[0].response;
            this.expenseCategoriesInfo = responses[1].response;
        })

        this.activateDatePickers(this.intervalFromElement, this.intervalToElement);
        const operationsResponse = await OperationsService.getOperations(FilterUtils.activateFilter(this.filterButtonArray[0]));
        if (operationsResponse.redirect) {
            this.openNewRoute(operationsResponse.redirect)
        }
        this.loadChartsData(operationsResponse.operations);
    }

    activateDatePickers (fromElement, toElement) {
        const that = this;
        const intervalElement = document.getElementById('interval-filter');

        new Datepicker(fromElement, {
            onChange: async function () {
                DateUtils.getDateFromPicker(fromElement, null);
                const operationsResponse = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement));
                if (operationsResponse && operationsResponse.redirect) {
                    return that.openNewRoute(operationsResponse.redirect);
                }
                if (operationsResponse && !operationsResponse.redirect && !operationsResponse.error) {
                    that.loadChartsData(operationsResponse.operations);
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
                    that.loadChartsData(operationsResponse.operations);
                }
            }
        });
    }

    async loadChartsData(operationsInfo) {
        let incomeColors = [];
        let incomeNames = [];
        let incomeData = [];
        const that = this;
        for (let i = 0; i < this.incomeCategoriesInfo.length; i++) {
            incomeNames.push(this.incomeCategoriesInfo[i].title);
            incomeColors.push(CommonUtils.getColor(i));
            let counter = 0;
            operationsInfo.filter(item => item.type === 'income' && item.category === that.incomeCategoriesInfo[i].title)
                .map(item => counter += item.amount);
            incomeData.push(counter);
        }
        this.incomeChart.data = {
            labels: incomeNames,
            datasets: [{
                data: incomeData,
                backgroundColor: incomeColors,
            }]
        }
        this.incomeChart.update();

        let expenseColors = [];
        let expenseNames = [];
        let expenseData = [];
        for (let i = 0; i < this.expenseCategoriesInfo.length; i++) {
            expenseNames.push(this.expenseCategoriesInfo[i].title);
            expenseColors.push(CommonUtils.getColor(i));
            let counter = 0;
            operationsInfo.filter(item => item.type === 'expense' && item.category === that.expenseCategoriesInfo[i].title)
                .map(item => counter += item.amount);
            expenseData.push(counter);
        }
        this.expenseChart.data = {
            labels: expenseNames,
            datasets: [{
                data: expenseData,
                backgroundColor: expenseColors,
            }]
        }
        this.expenseChart.update();

    }
}