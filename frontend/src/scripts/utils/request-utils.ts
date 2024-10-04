import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import {RequestResponseType} from "../types/response.type";
import {AuthInfoType} from "../types/auth-info.type";

export class RequestUtils {
    public static async sendRequest(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<RequestResponseType | undefined> {
        const result: RequestResponseType = {
            error: false,
            response: null,
            redirect: null
        }

        const params: any = {
            method: method,
            headers: {
                "Content-type": "application/json",
                "Asset": "application/json",
            }
        }

        let token: AuthInfoType | string | null = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers ["x-auth-token"] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    AuthUtils.deleteAuthInfo();
                    result.redirect = '/login';
                    return;
                } else {
                    const updateTokenResult: boolean = await AuthUtils.updateTokens();
                    if (updateTokenResult) {
                        return this.sendRequest(url, method, useAuth, body);
                    }
                    result.redirect = '/login';
                }
            }
        }
        return result;
    }
}