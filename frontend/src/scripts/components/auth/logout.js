import {AuthUtils} from "../../utils/auth-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        AuthUtils.deleteAuthInfo();
        this.openNewRoute('/login');
    }
}