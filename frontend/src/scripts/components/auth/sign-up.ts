import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {InputType} from "../../types/input.type";
import {AuthService} from "../../services/auth-service";
import {ErrorResponseType, LoginResponseType, SignupResponseType} from "../../types/response.type";
import {AuthInfoType, SignupInfoType, UserInfoType} from "../../types/auth-info.type";

export class SignUp {
    readonly openNewRoute: (route: string) => {};
    readonly nameInputElement: HTMLInputElement | null = null;
    readonly emailInputElement: HTMLInputElement | null = null;
    readonly passwordInputElement: HTMLInputElement | null = null;
    readonly passwordRepeatInputElement: HTMLInputElement | null = null;
    readonly commonErrorElement: HTMLElement | null;
    readonly processButton: HTMLElement | null = null;
    readonly inputArray: InputType[] = [];

    constructor(openNewRoute: (route: string) => {}) {
        this.openNewRoute = openNewRoute;

        this.nameInputElement = <HTMLInputElement>document.getElementById('floatingName')
        this.emailInputElement = <HTMLInputElement>document.getElementById('floatingInput');
        this.passwordInputElement = <HTMLInputElement>document.getElementById('floatingPassword');
        this.passwordRepeatInputElement = <HTMLInputElement>document.getElementById('floatingRepeatPassword');
        this.commonErrorElement = document.getElementById('common-error');

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
        }

        this.inputArray = [
            {
                element: this.nameInputElement,
                options: {pattern: /^[А-Я][а-я]*(-[А-Я][а-я]*)?\s[А-Я][а-я]*?\s[А-Я][а-я]*$/}
            },
            {element: this.emailInputElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordInputElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/}},
            {element: this.passwordRepeatInputElement, options: {compareTo: this.passwordInputElement.value}}
        ]
        this.processButton = document.getElementById('process-button');
        if (this.processButton) {
            this.processButton.addEventListener('click', this.signup.bind(this));
        }
    }

    private async signup(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = "none";
        }
        if (this.inputArray) {
            this.inputArray.find((input: InputType) => input?.element === this.passwordRepeatInputElement)!.options!.compareTo = this.passwordInputElement?.value;
        }
        if (ValidationUtils.validateForm(this.inputArray)) {
            if (this.nameInputElement && this.emailInputElement && this.passwordInputElement) {
                const userName: string[] = this.nameInputElement.value.split(' ');
                let signupResult: SignupResponseType | undefined = await AuthService.signUp({
                    name: userName[1],
                    lastName: userName[0],
                    email: this.emailInputElement.value,
                    password: this.passwordInputElement.value,
                    passwordRepeat: this.passwordRepeatInputElement?.value
                })
                if (signupResult) {
                    if (signupResult.error && signupResult.signup as ErrorResponseType) {
                        if ((signupResult.signup as ErrorResponseType).message === "User with given email already exist") {
                            if (this.commonErrorElement) {
                                this.commonErrorElement.innerText = "Пользователь с таким email уже существует";
                                this.commonErrorElement.style.display = "block";
                            }
                            return;
                        }
                    }

                    if (signupResult.signup as SignupInfoType) {
                        let loginResult: LoginResponseType | undefined = await AuthService.login({
                            email: (signupResult.signup as SignupInfoType).user.email,
                            password: this.passwordInputElement.value,
                            rememberMe: true
                        });
                        if (loginResult && !loginResult.error && loginResult.login as AuthInfoType) {
                            AuthUtils.setAuthInfo(<string>(loginResult.login as AuthInfoType).tokens.accessToken, <string>(loginResult.login as AuthInfoType).tokens.refreshToken, <UserInfoType>(loginResult.login as AuthInfoType).user);
                            this.openNewRoute("/");
                            return;
                        }
                    }
                }
            }
        }
    }
}