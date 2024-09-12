import {AuthUtils} from "../../utils/auth-utils";
import config from "../../config/config";
import {ValidationUtils} from "../../utils/validation-utils";

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

        this.inputArray = [{element: this.emailInputElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordInputElement}]
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    //TODO: оптимизация запросов
    async login() {
        this.commonErrorElement.style.display = "none";
        if(ValidationUtils.validateForm(this.inputArray)) {
            const result = {
                error: false,
                response: null
            }

            const params = {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Asset": "application/json",
                }
            };
            let body = {
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                rememberMe: this.rememberMeElement.checked
            }
            if (body) {
                params.body = JSON.stringify(body);
            }

            let response = await fetch(config.api + '/login', params);
            result.response = await response.json();
            if (result.response.error) {
                result.error = true;
            }

            if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken
                || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name))) {
                this.commonErrorElement.style.display = "block";
            } else {
                let loginResult = result.response;
                if (loginResult) {
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken,
                        {id: loginResult.user.id, name: loginResult.user.name});
                    return this.openNewRoute("/");
                }
            }
        }
    }
}