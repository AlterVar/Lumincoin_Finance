import {RequestUtils} from "./request-utils";

export class BalanceUtils {

    static async getBalance() {
        const balanceElement = document.getElementById('balance');
        let balanceResult = await RequestUtils.sendRequest('/balance', 'GET', true);
        if (!balanceResult.error) {
            balanceElement.innerText = balanceResult.response.balance + '$';
            return;
        }
    }

    static async updateBalance() {
        const balanceElement = document.getElementById('balance');
        const balanceInputElement = document.getElementById('balance-input');

        if (!balanceInputElement.value) {
            balanceInputElement.value = '0';
        }

        if (balanceInputElement.value !== balanceElement.innerText) {
            let balanceUpdateResult = await RequestUtils.sendRequest('/balance', 'PUT', true, {
                newBalance: balanceInputElement.value
            });
            if (!balanceUpdateResult.error) {
                balanceElement.innerText = balanceUpdateResult.response.balance + '$';
            } else {
                alert('Не удалось обновить баланс, обратитесь в службу поддержки');
            }
        }
    }
}