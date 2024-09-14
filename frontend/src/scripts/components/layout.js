import {BalanceUtils} from "../utils/balance-utils";
import {AuthUtils} from "../utils/auth-utils";

export class Layout {
    constructor() {
        this.balanceInputElement = document.getElementById('balance-input');
        this.balanceInputElement.addEventListener('blur', BalanceUtils.updateBalance);
        BalanceUtils.getBalance();
        this.setUserName();
    }

    setUserName() {
        const userNameElement = document.getElementById('user-name');
        const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        if (userInfo) {
            userNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
        }
    }
}