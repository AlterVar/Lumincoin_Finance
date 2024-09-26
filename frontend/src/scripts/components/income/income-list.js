import {AuthUtils} from "../../utils/auth-utils";
import {RequestUtils} from "../../utils/request-utils";
import {CommonUtils} from "../../utils/common-utils";

export class IncomeList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }
        this.cardsElement = document.getElementById('cards');
        this.addCardElement = document.getElementById('add-card');
        this.incomeDeleteButton = document.getElementById('delete-income-btn');

        this.incomeDeleteButton.onclick = this.deleteRedirect.bind(this);
        this.loadCategoriesInfo();
    }

    async loadCategoriesInfo() {
        const categoriesInfo = await RequestUtils.sendRequest('/categories/income');
        if (!categoriesInfo.error) {
            this.showCategories(categoriesInfo.response);
        }
    }

    showCategories(info) {
        for (let i = 0; i < info.length; i++) {
            const classes = ['col-12', 'col-sm-10', 'col-md-8', 'col-lg-6', 'col-xl-4', 'p-2'];
            let card = info[i];
            let cardWrapper = document.createElement('div');
            classes.forEach(item => {
                cardWrapper.classList.add(item);
            })
            let cardElement = document.createElement('div');
            cardElement.classList.add('card');
            let cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            let cardTitle = document.createElement('h3');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = card.title;

            let cardButtons = document.createElement('div');
            cardButtons.innerHTML = CommonUtils.generateButtons('income', card.id);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardButtons);
            cardElement.appendChild(cardBody);
            cardWrapper.appendChild(cardElement);
            this.cardsElement.insertBefore(cardWrapper ,this.addCardElement);
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
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        this.openNewRoute('/income/delete?id=' + id);
    }
}