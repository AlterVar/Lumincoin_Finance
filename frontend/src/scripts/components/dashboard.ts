import Chart, {ChartItem} from 'chart.js/auto';
import {AuthUtils} from "../utils/auth-utils";
import {FilterUtils} from "../utils/filter-utils";
import {CommonUtils} from "../utils/common-utils";
import {OperationsService} from "../services/operations-service";
import {CategoriesResponseType, OperationsResponseType} from "../types/response.type";
import {CategoriesService} from "../services/categories-service";
import {CategoriesType} from "../types/categories.type";
import {OperationsType} from "../types/operations.type";

export class Dashboard {
    readonly openNewRoute: (route: string) => {};
    private incomeChart: Chart<any> | null = null;
    private expenseChart: Chart<any> | null = null;
    private filterButtonArray: NodeList | null = null;
    private incomeCategoriesInfo: CategoriesType[] | null = null;
    private expenseCategoriesInfo: CategoriesType[] | null = null;
    private labelFromElement: HTMLElement | null = null;
    private labelToElement: HTMLElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.findElements();
        this.init();

        this.incomeChart = new Chart(
            document.getElementById('income-pie-chart') as ChartItem,
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
                data: <any>[]
            }
        );

        this.expenseChart = new Chart(
            document.getElementById('expense-pie-chart') as ChartItem,
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
                data: <any>[]
            }
        );


        const that: Dashboard = this;
        if (this.filterButtonArray) {
            for (let i = 0; i < this.filterButtonArray.length; i++) {
                const button: Node = this.filterButtonArray[i];
                button.addEventListener('click', async function (): Promise<void> {
                    const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(button as HTMLElement));
                    if (operationsResponse.redirect) {
                        that.openNewRoute(operationsResponse.redirect);
                        return;
                    }
                    if (operationsResponse.operations as OperationsType[]) {
                        await that.loadChartsData(operationsResponse.operations as OperationsType[]);
                    }
                });
            }
        }

    }

    findElements() {
        this.filterButtonArray = document.querySelectorAll('.filter-btn');
        this.labelFromElement = document.getElementById('interval-from');
        this.labelToElement = document.getElementById('interval-to');
    }

    private async init(): Promise<void> {
        const categories: string[] = ['income', 'expense'];
        const loadCategories: Promise<CategoriesResponseType>[] = categories.map((category: string) => CategoriesService.getCategories(category));

        await Promise.all(loadCategories).then((responses: CategoriesResponseType[]) => {
            responses.forEach((response: CategoriesResponseType) => {
                if (response.error) {
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
            })
            this.incomeCategoriesInfo = responses[0].categories as CategoriesType[];
            this.expenseCategoriesInfo = responses[1].categories as CategoriesType[];
        })
        this.activateDatePicker();

        if (this.filterButtonArray) {
            const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(this.filterButtonArray[0] as HTMLElement));
            if (operationsResponse.error && operationsResponse.redirect) {
                this.openNewRoute(operationsResponse.redirect);
                return;
            }
            if (operationsResponse.operations) {
                await this.loadChartsData(operationsResponse.operations as OperationsType[]);
            }
        }

    }

    private activateDatePicker() {
        const that: Dashboard = this;
        const intervalElement: HTMLElement = <HTMLElement>document.getElementById('interval-filter');
        const dateFrom: HTMLInputElement | null = <HTMLInputElement>document.getElementById('interval-from');
        const dateTo: HTMLInputElement | null = <HTMLInputElement>document.getElementById('interval-to');
        dateFrom!.addEventListener("focus", function () {
            dateFrom.type = 'date';
            dateFrom.showPicker();
        });
        dateFrom!.addEventListener('change', async function () {
            const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement));

            if (operationsResponse && operationsResponse.redirect) {
                return that.openNewRoute(operationsResponse.redirect);
            }
            if (operationsResponse && !operationsResponse.redirect && !operationsResponse.error && operationsResponse.operations as OperationsType[]) {
                that.loadChartsData(operationsResponse.operations as OperationsType[]);
            }
        });

        dateTo!.addEventListener("focus", function () {
            dateTo.type = 'date';
            dateTo.showPicker();
        });

        dateTo!.addEventListener('change', async function () {
            const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement));

            if (operationsResponse && operationsResponse.redirect) {
                return that.openNewRoute(operationsResponse.redirect);
            }
            if (operationsResponse && !operationsResponse.redirect && !operationsResponse.error && operationsResponse.operations as OperationsType[]) {
                that.loadChartsData(operationsResponse.operations as OperationsType[]);
            }
        });
    }

    private async loadChartsData(operationsInfo: OperationsType[]): Promise<void> {
        let incomeColors: string[] = [];
        let incomeNames: string[] = [];
        let incomeData: number[] = [];
        if (this.incomeCategoriesInfo) {
            for (let i = 0; i < this.incomeCategoriesInfo.length; i++) {
                incomeNames.push(this.incomeCategoriesInfo[i].title);
                incomeColors.push(CommonUtils.getColor(i));
                let counter: number = 0;
                operationsInfo.filter((item: OperationsType) => item.type === 'income' && item.category === (this.incomeCategoriesInfo![i]).title)
                    .map((item: OperationsType) => counter += item.amount);
                incomeData.push(counter);
            }
        }

        this.incomeChart!.data = {
            labels: incomeNames,
            datasets: [{
                data: incomeData,
                backgroundColor: incomeColors,
            }]
        }
        this.incomeChart!.update();

        let expenseColors: string[] = [];
        let expenseNames: string[] = [];
        let expenseData: number[] = [];
        if (this.expenseCategoriesInfo) {
            for (let i = 0; i < this.expenseCategoriesInfo.length; i++) {
                expenseNames.push(this.expenseCategoriesInfo[i].title);
                expenseColors.push(CommonUtils.getColor(i));
                let counter = 0;
                operationsInfo.filter((item: OperationsType) => item.type === 'expense' && item.category === this.expenseCategoriesInfo![i].title)
                    .map((item: OperationsType) => counter += item.amount);
                expenseData.push(counter);
            }
        }

        this.expenseChart!.data = {
            labels: expenseNames,
            datasets: [{
                data: expenseData,
                backgroundColor: expenseColors,
            }]
        }
        this.expenseChart!.update();

    }
}