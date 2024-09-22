import Chart from 'chart.js/auto'
import {AuthUtils} from "../utils/auth-utils";
import {DateUtils} from "../utils/date-utils";
import {FilterUtils} from "../utils/filter-utils";
import {RequestUtils} from "../utils/request-utils";
import {CommonUtils} from "../utils/common-utils";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        this.findElements();
        this.getIncomeCategories();
        this.getExpenseCategories();
        this.getOperations('all');

        DateUtils.activateDatePickers(this.intervalFromElement, this.intervalToElement);

        for (let i = 0; i < this.filterButtonArray.length; i++) {
            const that = this;
            const button = this.filterButtonArray[i];
            button.addEventListener('click', function () {
                that.getOperations(FilterUtils.activateFilter(button));
            });
        }

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
    }

    findElements() {
        this.filterButtonArray = document.querySelectorAll('.filter-btn');
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');
    }

    async getIncomeCategories() {
        const that = this;
        const incomeCategories = await RequestUtils.sendRequest('/categories/income');
        if (!incomeCategories.error) {
            that.incomeCategoriesInfo = incomeCategories.response;
        }
    }

    async getExpenseCategories() {
        const that = this;
        const expenseCategories = await RequestUtils.sendRequest('/categories/expense');
        if (!expenseCategories.error) {
            that.expenseCategoriesInfo = expenseCategories.response;
        }
    }

    async getOperations(filter) {
        const that = this;
        const operationsResult = await RequestUtils.sendRequest('/operations?period=' + filter, "GET", true)
        if (!operationsResult.error) {
            await that.loadChartsData(operationsResult.response);
        }
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