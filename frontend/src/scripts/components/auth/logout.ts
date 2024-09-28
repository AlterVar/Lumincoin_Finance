import {AuthUtils} from "../../utils/auth-utils";

export class Logout {
    readonly openNewRoute: (route: string) => {};

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        AuthUtils.deleteAuthInfo();
        this.openNewRoute('/login');
    }
}