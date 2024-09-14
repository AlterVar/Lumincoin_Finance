import {FileUtils} from "./scripts/utils/file-utils";
import {Dashboard} from "./scripts/components/dashboard";
import {Logout} from "./scripts/components/auth/logout";
import {Login} from "./scripts/components/auth/login";
import {SignUp} from "./scripts/components/auth/sign-up";
import {OperationsList} from "./scripts/components/operations/operations-list";
import {OperationsCreate} from "./scripts/components/operations/operations-create";
import {OperationsEdit} from "./scripts/components/operations/operations-edit";
import {OperationsDelete} from "./scripts/components/operations/operations-delete";
import {IncomeList} from "./scripts/components/income/income-list";
import {IncomeCreate} from "./scripts/components/income/income-create";
import {IncomeEdit} from "./scripts/components/income/income-edit";
import {IncomeDelete} from "./scripts/components/income/income-delete";
import {ExpenseList} from "./scripts/components/expense/expense-list";
import {ExpenseCreate} from "./scripts/components/expense/expense-create";
import {ExpenseEdit} from "./scripts/components/expense/expense-edit";
import {ExpenseDelete} from "./scripts/components/expense/expense-delete";
import {BalanceUtils} from "./scripts/utils/balance-utils";
import {Layout} from "./scripts/components/layout";

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
                    new Dashboard(this.openNewRoute.bind(this));
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
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: '/templates/auth/sign-up.html',
                layout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                template: '/templates/operations/operations-list.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new OperationsList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/create',
                title: 'Создание операции',
                template: '/templates/operations/operations-create.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new OperationsCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/edit',
                title: 'Редактирование операции',
                template: '/templates/operations/operations-edit.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: '/templates/income/income-list.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/create',
                title: 'Создание дохода',
                template: '/templates/income/income-create.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/edit',
                title: 'Редактирование дохода',
                template: '/templates/income/income-edit.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: '/templates/expense/expense-list.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new ExpenseList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/create',
                title: 'Создание расхода',
                template: '/templates/expense/expense-create.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/edit',
                title: 'Редактирование расхода',
                template: '/templates/expense/expense-edit.html',
                layout: '/templates/layout.html',
                styles: ['sidebars.css'],
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/delete',
                load: () => {
                    new ExpenseDelete(this.openNewRoute.bind(this));
                }
            }
        ]
    }

    init() {
        window.addEventListener('DOMContentLoaded', this.newRoute.bind(this));
        window.addEventListener('popstate', this.newRoute.bind(this));
        window.addEventListener("click", this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.newRoute(null, currentRoute);
    }

    async clickHandler(e) {
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

            await this.openNewRoute(url);
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
                    contentBlock = document.getElementById('inner-content');
                    new Layout();
                    this.activateMenuItem(newRoute);
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

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                if ((route.route === '/expense' && href === '/expense') || (route.route === '/income' && href === '/income')) {
                    document.getElementById('collapse-btn').classList.remove('collapsed');
                    document.getElementById('collapse-btn').setAttribute('aria-expanded', 'true');
                    document.getElementById('flush-collapseOne').classList.add('show');
                }
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }

        })

    }
}