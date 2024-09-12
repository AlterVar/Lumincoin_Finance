import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import config from "../../config/config";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.nameInputElement = document.getElementById('floatingName')
        this.emailInputElement = document.getElementById('floatingInput');
        this.passwordInputElement = document.getElementById('floatingPassword');
        this.passwordRepeatInputElement = document.getElementById('floatingRepeatPassword');
        this.commonErrorElement = document.getElementById('common-error');

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
        }

        this.inputArray = [
            {element: this.nameInputElement, options: {pattern: /^[А-Я][а-я]*(-[А-Я][а-я]*)?\s[А-Я][а-я]*$/}},
            {element: this.emailInputElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordInputElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatInputElement, options: {compareTo: this.passwordInputElement.value}}
        ]
        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    //TODO: оптимизация запросов
    async signup() {
        this.commonErrorElement.style.display = "none";
        this.inputArray.find(input => input.element === this.passwordRepeatInputElement).options.compareTo = this.passwordInputElement.value;
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
                name: this.nameInputElement.value,
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                passwordRepeat: this.passwordRepeatInputElement.value
            }
            if (body) {
                params.body = JSON.stringify(body);
            }

            let response = await fetch(config.api + '/signup', params);
            result.response = await response.json();
            if (result.response.error) {
                result.error = true;
            }
            if (!result.error || result.response) {
                let body = {
                    email: result.response.user.email,
                    password: this.passwordInputElement.value,
                    rememberMe: true
                }
                if (body) {
                    params.body = JSON.stringify(body);
                }
                let response = await fetch(config.api + '/login', params);
                result.response = await response.json();
                if (result.response.error) {
                    result.error = true;
                }
                if (result.response && (!result.response.tokens.accessToken
                    || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name)) {
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
}