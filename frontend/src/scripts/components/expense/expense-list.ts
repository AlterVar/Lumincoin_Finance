import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {CategoriesService} from "../../services/categories-service";
import {CategoriesResponseType} from "../../types/response.type";
import {CategoriesType} from "../../types/categories.type";

export class ExpenseList {
    readonly openNewRoute: (route: string) => {};
    readonly cardsElement: HTMLElement | null;
    readonly addCardElement: HTMLElement | null;
    readonly expenseDeleteButton: HTMLElement | null;
    private deleteButtonArray: NodeList;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }
        this.cardsElement = document.getElementById('cards');
        this.addCardElement = document.getElementById('add-card');
        this.expenseDeleteButton = document.getElementById('delete-expense-btn');

        if (this.expenseDeleteButton) {
            this.expenseDeleteButton.onclick = this.deleteRedirect.bind(this);
        }
        this.loadCategoriesInfo();
    }

    private async loadCategoriesInfo(): Promise<void> {
        const categoriesInfo: CategoriesResponseType = await CategoriesService.getCategories('expense');
        if (categoriesInfo.error) {
            if (categoriesInfo.redirect) {
                this.openNewRoute(categoriesInfo.redirect);
                return;
            }
        } else if(categoriesInfo.categories) {
            this.showCategories(categoriesInfo.categories);
        }
    }

    private showCategories(info: CategoriesType[]): void {
        for (let i = 0; i < info.length; i++) {
            const classes: string[] = ['col-12', 'col-sm-10', 'col-md-8', 'col-lg-6', 'col-xl-4', 'p-2'];
            let card: CategoriesType = info[i];
            let cardWrapper: HTMLElement = document.createElement('div');
            classes.forEach((item: string) => {
                cardWrapper.classList.add(item);
            })
            let cardElement: HTMLElement = document.createElement('div');
            cardElement.classList.add('card');
            let cardBody: HTMLElement = document.createElement('div');
            cardBody.classList.add('card-body');

            let cardTitle: HTMLElement = document.createElement('h3');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = card.title;

            let cardButtons: HTMLElement = document.createElement('div');
            cardButtons.innerHTML = CommonUtils.generateButtons('expense', card.id);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardButtons);
            cardElement.appendChild(cardBody);
            cardWrapper.appendChild(cardElement);
            if (this.cardsElement && this.addCardElement) {
                this.cardsElement.insertBefore(cardWrapper, this.addCardElement);
            }
        }
        this.activateDeleteButton();
    }

    private activateDeleteButton(): void {
        this.deleteButtonArray = document.querySelectorAll('.delete');
        for (let i = 0; i < this.deleteButtonArray.length; i++) {
            const button: Node = this.deleteButtonArray[i];
            button.addEventListener('click', function (e: Event) {
                e.preventDefault();
            });
        }
    }

    private deleteRedirect(e): void {
        e.preventDefault();

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string = urlParams.get('id');

        this.openNewRoute('/expense/delete?id=' + id);
    }
}