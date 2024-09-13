import {RequestUtils} from "./request-utils";

export class BalanceUtils {


    //balanceInputElement = document.getElementById('balance-input');


    static async getBalance() {
        let balanceElement = document.getElementById('balance');
        let balanceResult = await RequestUtils.sendRequest('/balance', 'GET', true);
        if (!balanceResult.error) {
            balanceElement.innerText = balanceResult.response.balance + '$';
            return;
        }
        console.log('error');
    }
}