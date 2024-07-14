export class Router {
    constructor() {
        this.pageTitleElement = document.getElementById('page-title');
        this.mainContentElement = document.getElementById('main-content');
        this.init();

        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                template: '/templates/dashboard.html',
                layout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/404',
                title: '404',
                template: '/templates/404.html',
                layout: false
            },
            {
                route: '/login',
                title: 'Авторизация',
                template: '/templates/login.html',
                layout: false,
                load: () => {

                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: '/templates/sign-up.html',
                layout: false,
                load: () => {

                }
            },
            {
                route: '/income&expenses',
                title: 'Доходы и расходы',
                template: '/templates/income_and_expenses.html',
                layout: '/templates/layout.html'
            }
        ]
    }

    init() {
        window.addEventListener('DOMContentLoaded', this.newRoute.bind(this));
        window.addEventListener('popstate', this.newRoute.bind(this));
    }

    async newRoute() {
        const url = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === url);

        if (newRoute) {
            if (newRoute.title) {
                this.pageTitleElement.innerText = newRoute.title;
            }

            if (newRoute.template) {
                this.mainContentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        }
    }
}