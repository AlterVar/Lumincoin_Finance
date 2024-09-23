import {AuthUtils} from "../../utils/auth-utils";

export class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }
    }
}