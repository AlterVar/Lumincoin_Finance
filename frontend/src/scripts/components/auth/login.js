import {AuthUtils} from "../../utils/auth-utils";
import config from "../../config/config";
import {ValidationUtils} from "../../utils/validation-utils";
import {RequestUtils} from "../../utils/request-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.emailInputElement = document.getElementById('floatingInput');
        this.passwordInputElement = document.getElementById('floatingPassword');
        this.rememberMeElement = document.getElementById('flexCheckDefault');
        this.commonErrorElement = document.getElementById('common-error');

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
        }

        this.inputArray = [{
            element: this.emailInputElement,
            options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
        },
            {element: this.passwordInputElement}]
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    async login() {
        this.commonErrorElement.style.display = "none";

        if (ValidationUtils.validateForm(this.inputArray)) {
            let loginResult = await RequestUtils.sendRequest('/login', 'POST', false, {
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                rememberMe: this.rememberMeElement.checked
            });
            if (!loginResult.error) {
                AuthUtils.setAuthInfo(loginResult.response.tokens.accessToken, loginResult.response.tokens.refreshToken,
                    {id: loginResult.response.user.id, name: loginResult.response.user.name});
                return this.openNewRoute("/");
            }
            this.commonErrorElement.style.display = "block";
        }
    }
}