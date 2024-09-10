export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.openNewRoute('/login');
    }
}