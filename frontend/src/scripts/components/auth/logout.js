import {AuthUtils} from "../../utils/auth-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        localStorage.removeItem(AuthUtils.accessTokenKey);
        localStorage.removeItem(AuthUtils.refreshTokenKey);
        localStorage.removeItem(AuthUtils.userInfoKey);

        this.openNewRoute('/login');
    }
}