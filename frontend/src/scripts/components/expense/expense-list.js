import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CommonUtils} from "../../utils/common-utils";

export class ExpenseList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }
        this.cardsElement = document.getElementById('cards');
        this.addCardElement = document.getElementById('add-card');
        this.expenseDeleteButton = document.getElementById('delete-expense-btn');

        if ( this.expenseDeleteButton) {
            this.expenseDeleteButton.onclick = this.deleteRedirect.bind(this);
        }

        this.loadCategoriesInfo();
    }

    async loadCategoriesInfo() {
        const categoriesInfo = await RequestUtils.sendRequest('/categories/expense');
        if (!categoriesInfo.error) {
            this.showCategories(categoriesInfo.response);
        }
    }

    showCategories(info) {
        for (let i = 0; i < info.length; i++) {
            const classes = ['col-12', 'col-sm-10', 'col-md-8', 'col-lg-6', 'col-xl-4', 'p-2', 'card-wrapper'];
            let card = info[i];
            let cardWrapper = document.createElement('div');
            classes.forEach(item => {
                cardWrapper.classList.add(item);
            })
            let cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.classList.add('h-100');
            let cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            cardBody.classList.add('d-flex');
            cardBody.classList.add('flex-column');
            cardBody.classList.add('justify-content-between');

            let cardTitle = document.createElement('h3');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = card.title;

            let cardButtons = document.createElement('div');
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

    activateDeleteButton() {
        this.deleteButtonArray = document.querySelectorAll('.delete');
        for (let i = 0; i < this.deleteButtonArray.length; i++) {
            const button = this.deleteButtonArray[i];
            button.addEventListener('click', function (e) {
                e.preventDefault();
            });
        }
    }

    deleteRedirect(e) {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        this.openNewRoute('/expense/delete?id=' + id);
    }
}