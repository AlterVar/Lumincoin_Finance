import {BalanceUtils} from "../utils/balance-utils";
import {AuthUtils} from "../utils/auth-utils";
import {AuthInfoType, UserInfoType} from "../types/auth-info.type";

export class Layout {
    readonly balanceInputElement: HTMLElement | null;

    constructor() {
        this.balanceInputElement = document.getElementById('balance-input');
        if (this.balanceInputElement) {
            this.balanceInputElement.addEventListener('blur', BalanceUtils.updateBalance);
        }
        BalanceUtils.getBalance();
        this.setUserName();
    }

    private setUserName(): void {
        const userNameElement: HTMLElement | null = document.getElementById('user-name');
        const userInfo: UserInfoType | AuthInfoType = JSON.parse(<string>AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        if ((userInfo as UserInfoType) && userNameElement) {
            userNameElement.innerText = (userInfo as UserInfoType).name + ' ' + (userInfo as UserInfoType).lastName;
        }
    }
}