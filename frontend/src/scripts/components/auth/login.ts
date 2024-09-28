import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {InputType} from "../../types/input.type";
import {LoginResponseType} from "../../types/response.type";
import {AuthService} from "../../services/auth-service";

export class Login {
    readonly openNewRoute: (route: string) => {};
    readonly emailInputElement: HTMLInputElement | null ;
    readonly passwordInputElement: HTMLInputElement | null;
    private rememberMeElement: HTMLInputElement | null;
    readonly commonErrorElement: HTMLElement | null;
    readonly inputArray: InputType[];

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
        }

        this.emailInputElement = <HTMLInputElement>document.getElementById('floatingInput');
        this.passwordInputElement = <HTMLInputElement>document.getElementById('floatingPassword');
        this.rememberMeElement = <HTMLInputElement>document.getElementById('flexCheckDefault');
        this.commonErrorElement = document.getElementById('common-error');

        this.inputArray = [{
            element: this.emailInputElement,
            options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
        },
            {element: this.passwordInputElement}]


        document.getElementById('process-button')?.addEventListener('click', this.login.bind(this));
    }

    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = "none";
        }

        if (ValidationUtils.validateForm(this.inputArray)) {
            let loginResult: LoginResponseType = await AuthService.login({
                email: this.emailInputElement?.value,
                password: this.passwordInputElement?.value,
                rememberMe: this.rememberMeElement?.checked
            });

            if (loginResult && !loginResult.error && loginResult.login) {
                AuthUtils.setAuthInfo(loginResult.login.accessToken, loginResult.login.refreshToken, loginResult.login.userInfo);
                this.openNewRoute("/");
                return;
            }
            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = "block";
            }
        }
    }
}