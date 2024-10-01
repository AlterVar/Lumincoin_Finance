import {LoginResponseType, RequestResponseType, SignupResponseType} from "../types/response.type";
import {RequestUtils} from "../utils/request-utils";
import {AuthInfoType, UserInfoType} from "../types/auth-info.type";

export class AuthService {
    //TODO: заменить data:any
    public static async login(data: any): Promise<LoginResponseType> {
        const returnObj: LoginResponseType = {
            error: false,
            redirect: null,
            login: null
        }

        const loginResult: RequestResponseType = await RequestUtils.sendRequest('/login', 'POST', false, data);

        if (loginResult.redirect || loginResult.error || !loginResult.response || (loginResult.response && loginResult.response.error)) {
            returnObj.error = true;
            console.log(loginResult.response.message);
            alert('Возникла ошибка при авторизации. Обратитесь в поддержку');
            if (loginResult.redirect) {
                returnObj.redirect = loginResult.redirect;
            }
            return returnObj;
        }
        if (loginResult.response) {
            returnObj.login = loginResult.response;
        }
        return returnObj;
    }
     //TODO: заменить data:any
    public static async signUp(data: any): Promise<SignupResponseType> {
        const returnObj: SignupResponseType = {
            error: false,
            redirect: null,
            signup: null
        }

        const loginResult: RequestResponseType = await RequestUtils.sendRequest('/signup', 'POST', false, data);

        if (loginResult.redirect || loginResult.error || !loginResult.response || (loginResult.response && loginResult.response.error)) {
            returnObj.error = true;
            console.log(loginResult.response.message);
            alert('Возникла ошибка при авторизации. Обратитесь в поддержку');
            if (loginResult.redirect) {
                returnObj.redirect = loginResult.redirect;
            }
            return returnObj;
        }
        if (loginResult.response) {
            returnObj.signup = loginResult.response;
        }
        return returnObj;
    }
}