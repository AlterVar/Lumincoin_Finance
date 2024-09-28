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
import {RouteType} from "./scripts/types/route.type";
import {AuthUtils} from "./scripts/utils/auth-utils";
import {UserInfoType} from "./scripts/types/auth-info.type";
import {BalanceUtils} from "./scripts/utils/balance-utils";

export class Router {
    readonly pageTitleElement: HTMLElement | null;
    readonly mainContentElement: HTMLElement | null;
    readonly layoutPath: string;
    private userName: string | null;
    private routes: RouteType[];
    private balanceInputElement: HTMLElement | null;

    constructor() {
        this.pageTitleElement = document.getElementById('page-title');
        this.mainContentElement = document.getElementById('main-content');
        this.layoutPath = '/templates/layout.html';
        this.init();

        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                template: '/templates/dashboard.html',
                layout: true,
                styles: ['sidebars.css', 'datepicker.material.css'],
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
                layout: false,
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                template: '/templates/operations/operations-list.html',
                layout: true,
                styles: ['sidebars.css', 'datepicker.material.css'],
                load: () => {
                    new OperationsList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/create',
                title: 'Создание операции',
                template: '/templates/operations/operations-create.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new OperationsCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/edit',
                title: 'Редактирование операции',
                template: '/templates/operations/operations-edit.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/delete',
                layout: false,
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: '/templates/income/income-list.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/create',
                title: 'Создание дохода',
                template: '/templates/income/income-create.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/edit',
                title: 'Редактирование дохода',
                template: '/templates/income/income-edit.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/delete',
                layout: false,
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: '/templates/expense/expense-list.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new ExpenseList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/create',
                title: 'Создание расхода',
                template: '/templates/expense/expense-create.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/edit',
                title: 'Редактирование расхода',
                template: '/templates/expense/expense-edit.html',
                layout: true,
                styles: ['sidebars.css'],
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/delete',
                layout: false,
                load: () => {
                    new ExpenseDelete(this.openNewRoute.bind(this));
                }
            }
        ]
    }

    private init(): void {
        window.addEventListener('DOMContentLoaded', this.newRoute.bind(this));
        window.addEventListener('popstate', this.newRoute.bind(this));
        window.addEventListener("click", this.clickHandler.bind(this));
    }

     private async openNewRoute(url): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState({}, '', url);
        await this.newRoute(null, currentRoute);
    }

    private async clickHandler(e): Promise<void> {
        let element: URL | null = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const url: string | null = element.href.replace(window.location.origin, '')
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    private async newRoute(e, oldRoute = null): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | null = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach((style: string) => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                })
            }

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach((script: string) => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }
        }

        const url: string = window.location.pathname;
        const newRoute: RouteType | null = this.routes.find(item => item.route === url);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach((style: string) => {
                    const link: HTMLLinkElement = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;

                    document.head.insertBefore(link, <HTMLElement>this.pageTitleElement);
                })
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title && this.pageTitleElement) {
                this.pageTitleElement.innerText = newRoute.title;
            }

            if (newRoute.template) {
                if (this.mainContentElement) {
                    let contentBlock: HTMLElement | null = this.mainContentElement;
                    if (newRoute.layout) {
                        contentBlock.innerHTML = await fetch(this.layoutPath).then(response => response.text());
                        this.activateMenuItem(newRoute);

                        const userNameElement = document.getElementById('user-name');
                        if (!this.userName) {
                            const userInfo: UserInfoType | null = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey) as string);
                            if (userInfo) {
                                this.userName = userInfo.name + ' ' + userInfo.lastName;
                            }
                        } else {
                            userNameElement.innerText = this.userName;
                        }

                        this.balanceInputElement = document.getElementById('balance-input');
                        if (this.balanceInputElement) {
                            this.balanceInputElement.addEventListener('blur', BalanceUtils.updateBalance);
                            await BalanceUtils.getBalance();
                        }


                        contentBlock = document.getElementById('inner-content');
                    }
                    contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.newRoute(null);
        }
    }

    private activateMenuItem(route): void {
        document.querySelectorAll('.sidebar .nav-link').forEach((item: Element) => {
            const href: string = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                if ((route.route === '/expense' && href === '/expense') || (route.route === '/income' && href === '/income')) {
                    document.getElementById('collapse-btn')?.classList.remove('collapsed');
                    document.getElementById('collapse-btn')?.setAttribute('aria-expanded', 'true');
                    document.getElementById('flush-collapseOne')?.classList.add('show');
                }
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })
    }
}