import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {CategoriesResponseType} from "../../types/response.type";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesType} from "../../types/categories.type";

export class IncomeList {
    readonly openNewRoute: (route: string) => {};
    readonly cardsElement: HTMLElement | null = null;
    readonly addCardElement: HTMLElement | null = null;
    readonly incomeDeleteButton: HTMLElement | null = null;
    private deleteButtonArray: NodeList | null = null;

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }
        this.cardsElement = document.getElementById('cards');
        this.addCardElement = document.getElementById('add-card');
        this.incomeDeleteButton = document.getElementById('delete-income-btn');
        if (this.incomeDeleteButton) {
            this.incomeDeleteButton.onclick = this.deleteRedirect.bind(this);
        }

        this.loadCategoriesInfo();


    }

    private async loadCategoriesInfo(): Promise<void> {
        const categoriesInfo: CategoriesResponseType = await CategoriesService.getCategories('income');
        if (categoriesInfo.error) {
            if (categoriesInfo.redirect) {
                this.openNewRoute(categoriesInfo.redirect);
                return;
            }
        } else if(categoriesInfo.categories as CategoriesType[]) {
            this.showCategories(categoriesInfo.categories as CategoriesType[]);
        }
    }

    private showCategories(info: CategoriesType[]): void {
        for (let i = 0; i < info.length; i++) {
            const classes: string[] = ['col-12', 'col-sm-10', 'col-md-8', 'col-lg-6', 'col-xl-4', 'p-2', 'card-wrapper'];
            const card: CategoriesType = info[i];
            const cardWrapper: HTMLElement = document.createElement('div');
            classes.forEach((item: string) => {
                cardWrapper.classList.add(item);
            })

            const cardElement: HTMLElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.classList.add('h-100');

            const cardBody: HTMLElement = document.createElement('div');
            cardBody.classList.add('card-body');
            cardBody.classList.add('d-flex');
            cardBody.classList.add('flex-column');
            cardBody.classList.add('justify-content-between');

            const cardTitle: HTMLElement = document.createElement('h3');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = card.title;

            const cardButtons: HTMLElement = document.createElement('div');
            cardButtons.innerHTML = CommonUtils.generateButtons('income', card.id!);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardButtons);
            cardElement.appendChild(cardBody);
            cardWrapper.appendChild(cardElement);
            if (this.cardsElement && this.addCardElement) {
                this.cardsElement.insertBefore(cardWrapper ,this.addCardElement);
            }
        }

        this.activateDeleteButton();
    }

    activateDeleteButton() {
        this.deleteButtonArray = document.querySelectorAll('.delete');
        for (let i = 0; i < this.deleteButtonArray.length; i++) {
            const button: Node = this.deleteButtonArray[i];
            button.addEventListener('click', function (e) {
                e.preventDefault();
            });
        }
    }

    private deleteRedirect(e: any): void {
        e.preventDefault();

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (id) {
            this.openNewRoute('/income/delete?id=' + id);
        }
    }
}