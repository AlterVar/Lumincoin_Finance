import {LoginResponseType, RequestResponseType, SignupResponseType} from "../types/response.type";
import {RequestUtils} from "../utils/request-utils";
import {AuthInfoType, UserInfoType} from "../types/auth-info.type";

export class AuthService {
    //TODO: заменить data:any
    public static async login(data: any): Promise<LoginResponseType | undefined> {
        const returnObj: LoginResponseType = {
            error: false,
            redirect: null,
            login: null
        }

        const loginResult: RequestResponseType | undefined = await RequestUtils.sendRequest('/login', 'POST', false, data);

        if (loginResult) {
            if (loginResult.error || !loginResult.response || (loginResult.response && loginResult.response.error)) {
                returnObj.error = true;
                if (loginResult.response && loginResult.response.message) {
                    returnObj.login = loginResult.response;
                    return returnObj;
                }
                alert('Возникла ошибка при авторизации. Обратитесь в поддержку');
                return returnObj;
            }
            if (loginResult.response) {
                returnObj.login = loginResult.response;
            }
            return returnObj;
        }
    }

    //TODO: заменить data:any
    public static async signUp(data: any): Promise<SignupResponseType | undefined> {
        const returnObj: SignupResponseType = {
            error: false,
            redirect: null,
            signup: null
        }

        const signupResult: RequestResponseType | undefined = await RequestUtils.sendRequest('/signup', 'POST', false, data);

        if (signupResult) {
            if (signupResult.error || !signupResult.response || (signupResult.response && signupResult.response.error)) {
                returnObj.error = true;
                if  (signupResult.response && signupResult.response.message) {
                    returnObj.signup = signupResult.response;
                    return returnObj;
                }
                alert('Возникла ошибка при регистрации. Обратитесь в поддержку');
                return returnObj;
            }
            if (signupResult.response) {
                returnObj.signup = signupResult.response;
            }
            return returnObj;
        }
    }
}