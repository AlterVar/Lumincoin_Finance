import {AuthUtils} from "../../utils/auth-utils";

export class Logout {
    readonly openNewRoute: (route: string) => {};

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        AuthUtils.deleteAuthInfo();
        this.openNewRoute('/login');
    }
}