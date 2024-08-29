import {FileUtils} from "./scripts/utils/file-utils";
import {Dashboard} from "./scripts/components/dashboard";

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
                styles: ['sidebars.css'],
                scripts: ['chart.umd.js'],
                load: () => {
                    new Dashboard();
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
                template: '/templates/auth/login.html',
                layout: false,
                load: () => {

                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: '/templates/auth/sign-up.html',
                layout: false,
                load: () => {

                }
            },
            {
                route: '/logout',
                load: () => {
                }
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                template: '/templates/operations/operations-list.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/operations/create',
                title: 'Создание операции',
                template: '/templates/operations/operations-create.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/operations/edit',
                title: 'Редактирование операции',
                template: '/templates/operations/operations-edit.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/operations/delete',
                load: () => {

                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: '/templates/income/income-list.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/income/create',
                title: 'Создание дохода',
                template: '/templates/income/income-create.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/income/edit',
                title: 'Редактирование дохода',
                template: '/templates/income/income-edit.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/income/delete',
                load: () => {
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: '/templates/expense/expense-list.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/expense/create',
                title: 'Создание расхода',
                template: '/templates/expense/expense-create.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/expense/edit',
                title: 'Редактирование расхода',
                template: '/templates/expense/expense-edit.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
            },
            {
                route: '/expense/delete',
                load: () => {
                }
            }
        ]
    }

    init() {
        window.addEventListener('DOMContentLoaded', this.newRoute.bind(this));
        window.addEventListener('popstate', this.newRoute.bind(this));
        window.addEventListener("click", this.openNewRoute.bind(this));
    }

    async openNewRoute(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '')
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            const currentRoute = window.location.pathname;
            history.pushState({}, '', url);
            await this.newRoute(null, currentRoute);
        }
    }

    async newRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                })
            }

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const url = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === url);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;

                    document.head.insertBefore(link, this.pageTitleElement);
                })
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title) {
                this.pageTitleElement.innerText = newRoute.title;
            }

            if (newRoute.template) {
                let contentBlock = this.mainContentElement;
                if (newRoute.layout) {
                    this.mainContentElement.innerHTML = await fetch(newRoute.layout).then(response => response.text());
                    contentBlock.classList.add('d-flex');
                    contentBlock = document.getElementById('inner-content');
                } else {
                    contentBlock.classList.remove('d-flex');
                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.newRoute();
        }
    }
}