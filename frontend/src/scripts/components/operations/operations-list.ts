import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {DateUtils} from "../../utils/date-utils";
import {FilterUtils} from "../../utils/filter-utils";
import {OperationsService} from "../../services/operations-service";
import {OperationsResponseType} from "../../types/response.type";
import {OperationsType} from "../../types/operations.type";

export class OperationsList {
    readonly openNewRoute: (route: string) => {};
    private filterButtonArray: NodeList | null = null;
    private operationDeleteButton: HTMLElement | null = null;


    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.findElements();
        this.init()

        if (this.filterButtonArray) {
            for (let i = 0; i < this.filterButtonArray.length; i++) {
                const that: OperationsList = this;
                const button: HTMLElement | Node = this.filterButtonArray[i];
                button.addEventListener('click', async function () {
                    const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(button as HTMLElement));
                    if (operationsResponse.redirect) {
                        that.openNewRoute(operationsResponse.redirect);
                        return;
                    }
                    that.createTable(operationsResponse.operations as OperationsType[]);
                });
            }
        }
    }

    private findElements(): void {
        this.filterButtonArray = document.querySelectorAll('.filter-btn');
        this.operationDeleteButton = document.getElementById('delete-operation-btn');
    }

    private async init (): Promise<void> {
        if (this.operationDeleteButton) {
            this.operationDeleteButton.addEventListener('click', this.deleteRedirect.bind(this));
        }

        this.activateDatePickers();

        if (this.filterButtonArray) {
            const operationsResponse: OperationsResponseType = await OperationsService.getOperations
            (FilterUtils.activateFilter(this.filterButtonArray[0] as HTMLElement));
            if (operationsResponse.redirect) {
                this.openNewRoute(operationsResponse.redirect);
                return;
            }
            this.createTable(operationsResponse.operations as OperationsType[]);
        }
    }

    private activateDatePickers (): void {
        const that: OperationsList = this;
        const intervalElement: HTMLElement | null = document.getElementById('interval-filter');
        const dateFrom: HTMLInputElement | null = <HTMLInputElement>document.getElementById('interval-from');
        const dateTo: HTMLInputElement | null = <HTMLInputElement>document.getElementById('interval-to');
        dateFrom!.addEventListener("focus", function () {
            dateFrom.type = 'date';
            dateFrom.showPicker();
        });
        dateFrom!.addEventListener('change', async function () {
            const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement!));

            if (operationsResponse && operationsResponse.redirect) {
                return that.openNewRoute(operationsResponse.redirect);
            }
            if (operationsResponse && !operationsResponse.redirect && !operationsResponse.error && operationsResponse.operations as OperationsType[]) {
                that.createTable(operationsResponse.operations as OperationsType[]);
            }
        });

        dateTo!.addEventListener("focus", function () {
            dateTo.type = 'date';
            dateTo.showPicker();
        });

        dateTo!.addEventListener('change', async function () {
            const operationsResponse: OperationsResponseType = await OperationsService.getOperations(FilterUtils.activateFilter(intervalElement!));

            if (operationsResponse && operationsResponse.redirect) {
                return that.openNewRoute(operationsResponse.redirect);
            }
            if (operationsResponse && !operationsResponse.redirect && !operationsResponse.error && operationsResponse.operations as OperationsType[]) {
                that.createTable(operationsResponse.operations as OperationsType[]);
            }
        });
    }

    private createTable(operations: OperationsType[]): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (recordsElement) {
            recordsElement.innerHTML = '';
            for (let i = 0; i < operations.length; i++) {
                let record = operations[i];
                if (!record.category) {
                    record.category = 'неизвестна';
                }
                const trElement = document.createElement('tr');
                trElement.insertCell().innerText = (i + 1).toString();
                trElement.insertCell().innerHTML = CommonUtils.getOperationType(record.type);
                trElement.insertCell().innerText = record.category;
                trElement.insertCell().innerText = record.amount + '$';
                trElement.insertCell().innerText = DateUtils.formatDate(record.date, '-') as string;
                trElement.insertCell().innerText = record.comment;
                trElement.insertCell().innerHTML = CommonUtils.generateTools('operations', record.id!);


                recordsElement.appendChild(trElement);
            }
        }

        this.activateDeleteButton();
    }

    private activateDeleteButton(): void {
        const deleteButtonArray = document.querySelectorAll('.delete');
        for (let i = 0; i < deleteButtonArray.length; i++) {
            const button: Node = deleteButtonArray[i];
            button.addEventListener('click', function (e) {
                e.preventDefault();
            });
        }
    }

    private deleteRedirect(e:any): void {
        e.preventDefault();
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (id) {
            this.openNewRoute('/operations/delete?id=' + id);
        }
    }
}