import config from "../config/config";
import {AuthUtils} from "./auth-utils";

export class RequestUtils {

    static async sendRequest(url, method = 'GET', useAuth = false, body = null) {
        const result = {
            error: false,
            response: null
        }

        const params = {
            method: method,
            headers: {
                "Content-type": "application/json",
                "Asset": "application/json",
            }
        }

        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers ["authorization"] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
            if (result.response.error) {
                result.error = true;
                return result;
            }
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
                    const updateTokenResult = await AuthUtils.updateTokens();

                    if (updateTokenResult) {
                        return this.sendRequest(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}