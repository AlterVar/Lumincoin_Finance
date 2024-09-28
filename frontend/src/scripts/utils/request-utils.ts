import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import {RequestResponseType} from "../types/response.type";
import {AuthInfoType} from "../types/auth-info.type";

export class RequestUtils {

<<<<<<< Updated upstream:frontend/src/scripts/utils/request-utils.js
    static async sendRequest(url, method = 'GET', useAuth = false, body = null) {
        const result = {
=======
    public static async sendRequest(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<RequestResponseType> {
        const result: RequestResponseType = {
>>>>>>> Stashed changes:frontend/src/scripts/utils/request-utils.ts
            error: false,
            response: null
        }

        const params: any = {
            method: method,
            headers: {
                "Content-type": "application/json",
                "Asset": "application/json",
            }
        }

        let token: string | AuthInfoType | null = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
<<<<<<< Updated upstream:frontend/src/scripts/utils/request-utils.js
            if (token) {
                params.headers ["authorization"] = token;
=======
            if (token as string) {
                params.headers ["x-auth-token"] = token;
>>>>>>> Stashed changes:frontend/src/scripts/utils/request-utils.ts
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
                    result.redirect = '/login';
                } else {
                    const updateTokenResult: boolean = await AuthUtils.updateTokens();

                    if (updateTokenResult) {
                        return this.sendRequest(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
<<<<<<< Updated upstream:frontend/src/scripts/utils/request-utils.js
=======
                    result.redirect = '/login';
>>>>>>> Stashed changes:frontend/src/scripts/utils/request-utils.ts
                }
            }
        }
        return result;
    }
}