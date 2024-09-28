import Chart from 'chart.js/auto'
import {AuthUtils} from "../utils/auth-utils";
import {DateUtils} from "../utils/date-utils";
import {FilterUtils} from "../utils/filter-utils";
import {CommonUtils} from "../utils/common-utils";
import Datepicker from "../datepicker";
import {OperationsService} from "../services/operations-service";
import {CategoriesResponseType, OperationsResponseType} from "../types/response.type";
import {CategoriesService} from "../services/categories-service";
import {CategoriesType} from "../types/categories.type";
import {OperationsType} from "../types/operations.type";

export class Dashboard {
    readonly openNewRoute: (route: string) => {};
    private incomeChart: Chart<any>;
    private expenseChart: Chart<any>;
    private filterButtonArray: NodeList;
    private intervalFromElement: HTMLElement | null;
    private intervalToElement: HTMLElement | null;
    private incomeCategoriesInfo: CategoriesType[] | null;
    private expenseCategoriesInfo: CategoriesType[] | null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
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


        const that: Dashboard = this;
        for (let i = 0; i < this.filterButtonArray.length; i++) {
            const button: Node = this.filterButtonArray[i];
            button.addEventListener('click', async function (): Promise<void> {
                const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(button));
                if (operationsResponse.redirect) {
                    that.openNewRoute(operationsResponse.redirect);
                    return;
                }
                if (operationsResponse.operations) {
                    that.loadChartsData(operationsResponse.operations);
                }
            });
        }
    }

    findElements() {
        this.filterButtonArray = document.querySelectorAll('.filter-btn');
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');
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

        this.activateDatePickers(this.intervalFromElement, this.intervalToElement);
        const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(this.filterButtonArray[0]));
        if (operationsResponse.error && operationsResponse.redirect) {
            this.openNewRoute(operationsResponse.redirect);
            return;
        }
        if (operationsResponse.operations) {
            this.loadChartsData(operationsResponse.operations);
        }
    }

    private activateDatePickers (fromElement: HTMLElement | null, toElement: HTMLElement | null): void {
        const that: Dashboard = this;
        const intervalElement: HTMLElement | null = document.getElementById('interval-filter');

        new Datepicker(fromElement, {
            onChange: async function (): Promise<void> {
                DateUtils.getDateFromPicker(fromElement, null);
                const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement));
                if (operationsResponse.error && operationsResponse.redirect) {
                    that.openNewRoute(operationsResponse.redirect);
                    return;
                }
                if (operationsResponse && operationsResponse.operations && !operationsResponse.redirect && !operationsResponse.error) {
                    that.loadChartsData(operationsResponse.operations);
                }
            }
        });

        new Datepicker(toElement, {
            onChange: async function (): Promise<void> {
                DateUtils.getDateFromPicker(null, toElement);
                const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement));
                if (operationsResponse.error && operationsResponse.redirect) {
                    that.openNewRoute(operationsResponse.redirect);
                    return;
                }
                if (operationsResponse && operationsResponse.operations && !operationsResponse.redirect && !operationsResponse.error) {
                    that.loadChartsData(operationsResponse.operations);
                }
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

        this.incomeChart.data = {
            labels: incomeNames,
            datasets: [{
                data: incomeData,
                backgroundColor: incomeColors,
            }]
        }
        this.incomeChart.update();

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