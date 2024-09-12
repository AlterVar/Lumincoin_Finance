export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static getAuthInfo(key = null) {
        if(key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey),
            }
        }
    }

    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    static deleteAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }
}