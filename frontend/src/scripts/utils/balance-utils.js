import {RequestUtils} from "./request-utils";

export class BalanceUtils {

    static async getBalance() {
        const balanceElement = document.getElementById('balance');
        let balanceResult = await RequestUtils.sendRequest('/balance');
        if (!balanceResult.error && !balanceResult.response.error) {
            balanceElement.innerText = balanceResult.response.balance.toString() + '$';
        }
    }

    static async updateBalance() {
        const balanceElement = document.getElementById('balance');
        const balanceInputElement = document.getElementById('balance-input');
        const balanceValue = parseInt(balanceInputElement.value);

        if (!balanceValue) {
            balanceInputElement.value = 0;
        }

        if (balanceValue !== parseInt(balanceElement.innerText)) {
            let balanceUpdateResult = await RequestUtils.sendRequest('/balance', 'PUT', true, {
                newBalance: balanceValue
            });
            if (!balanceUpdateResult.error) {
                balanceElement.innerText = balanceUpdateResult.response.balance.toString() + '$';
            } else {
                alert('Не удалось обновить баланс, обратитесь в службу поддержки');
            }
        }
    }
}