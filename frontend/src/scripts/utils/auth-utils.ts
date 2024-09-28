import config from "../config/config";
import {AuthInfoType, UserInfoType} from "../types/auth-info.type";
import {ErrorResponseType, TokensResponseType} from "../types/response.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static getAuthInfo(key: string | null = null): AuthInfoType | string {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                accessToken: localStorage.getItem(this.accessTokenKey),
                refreshToken: localStorage.getItem(this.refreshTokenKey),
                userInfo: localStorage.getItem(this.userInfoKey) as UserInfoType
            }
        }
    }

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    public static async updateTokens(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | AuthInfoType = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken && typeof refreshToken === "string") {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Asset": "application/json",
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            //TODO: а при 200 разве может прийти errorType?
            if (response && response.status === 200) {
                const tokens: ErrorResponseType | TokensResponseType = await response.json();
                if ((tokens as ErrorResponseType) && (tokens as ErrorResponseType).error) {
                    console.log((tokens as ErrorResponseType).message);
                    result = false;
                } else if (tokens as TokensResponseType) {
                    this.setAuthInfo((tokens as TokensResponseType).tokens.accessToken, (tokens as TokensResponseType).tokens.refreshToken)
                    result = true;
                }
            }
        }
        if (!result) {
            this.deleteAuthInfo();
        }
        return result;
    }

    public static deleteAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }
}