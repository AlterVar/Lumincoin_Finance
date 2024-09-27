import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {RequestUtils} from "../../utils/request-utils";

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
            {element: this.nameInputElement, options: {pattern: /^[А-Я][а-я]*(-[А-Я][а-я]*)?\s[А-Я][а-я]*?\s[А-Я][а-я]*$/}},
            {element: this.emailInputElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordInputElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/}},
            {element: this.passwordRepeatInputElement, options: {compareTo: this.passwordInputElement.value}}
        ]
        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    async signup() {
        this.commonErrorElement.style.display = "none";
        this.inputArray.find(input => input.element === this.passwordRepeatInputElement).options.compareTo = this.passwordInputElement.value;
        if(ValidationUtils.validateForm(this.inputArray)) {
            const userName = this.nameInputElement.value.split(' ');

            let signupResult = await RequestUtils.sendRequest('/signup', 'POST', false, {
                name: userName[1],
                lastName: userName[0],
                email: this.emailInputElement.value,
                password: this.passwordInputElement.value,
                passwordRepeat: this.passwordRepeatInputElement.value
            })

            if (!signupResult.error) {
                let loginResult = await RequestUtils.sendRequest('/login', 'POST', false, {
                    email: signupResult.response.user.email,
                    password: this.passwordInputElement.value,
                    rememberMe: true
                });
                if (loginResult) {
                    AuthUtils.setAuthInfo(loginResult.response.tokens.accessToken, loginResult.response.tokens.refreshToken,
                        {id: loginResult.response.user.id, name: loginResult.response.user.name, lastName: loginResult.response.user.lastName});
                    return this.openNewRoute("/");
                }
            }
                this.commonErrorElement.style.display = "block";
        }
    }
}