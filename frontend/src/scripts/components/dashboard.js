import Chart from 'chart.js/auto'
import {AuthUtils} from "../utils/auth-utils";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }
        this.loadCharts();
    }

    loadCharts() {
        const dataIncome = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue'
            ],
            datasets: [{
                data: [25, 40, 15, 10, 10],
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD'
                ],
            }]
        }
        new Chart(
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
                data: dataIncome
            }
        );

        const dataExpense = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue'
            ],
            datasets: [{
                data: [40, 30, 15, 5, 10],
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD'
                ],
            }]
        }
        new Chart(
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
                data: dataExpense
            }
        );
    }
}