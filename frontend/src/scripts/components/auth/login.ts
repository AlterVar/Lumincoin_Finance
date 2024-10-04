import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {InputType} from "../../types/input.type";
import {ErrorResponseType, LoginResponseType} from "../../types/response.type";
import {AuthService} from "../../services/auth-service";
import {AuthInfoType, SignupInfoType, UserInfoType} from "../../types/auth-info.type";
import {ErrorInfo} from "ts-loader/dist/interfaces";

export class Login {
    readonly openNewRoute: (route: string) => {};
    readonly emailInputElement: HTMLInputElement | null;
    readonly passwordInputElement: HTMLInputElement | null;
    private rememberMeElement: HTMLInputElement | null;
    readonly commonErrorElement: HTMLElement | null;
    readonly inputArray: InputType[];

    constructor(openNewRoute: (url: string) => Promise<void>) {
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
            let loginResult: LoginResponseType | undefined = await AuthService.login({
                email: this.emailInputElement?.value,
                password: this.passwordInputElement?.value,
                rememberMe: this.rememberMeElement?.checked
            });
            if (loginResult) {
                if (this.commonErrorElement && (loginResult.login as ErrorResponseType)) {
                    if ((loginResult.login as ErrorResponseType).message) {
                        if (this.commonErrorElement) {
                            this.commonErrorElement.style.display = "block";
                        }
                        return;
                    }
                }
                if (loginResult.login as AuthInfoType) {
                    AuthUtils.setAuthInfo((loginResult.login as AuthInfoType).tokens.accessToken!, (loginResult.login as AuthInfoType).tokens.refreshToken!, <UserInfoType>(loginResult.login as AuthInfoType).user);
                    this.openNewRoute("/");
                    return;
                }
            }
        }
    }
}