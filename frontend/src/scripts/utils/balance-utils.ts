import {RequestUtils} from "./request-utils";
import {BalanceResponseType, RequestResponseType} from "../types/response.type";

export class BalanceUtils {

    public static async getBalance(): Promise<BalanceResponseType> {
        const resultObj: BalanceResponseType = {
            error: false,
            redirect: null,
            balance: null
        }

        const balanceElement: HTMLElement | null = document.getElementById('balance');
        if (balanceElement) {
            const balanceResult: RequestResponseType | undefined = await RequestUtils.sendRequest('/balance', 'GET');
            if (balanceResult) {
                if (balanceResult.error) {
                    resultObj.error = true;
                    if (balanceResult.redirect) {
                        resultObj.redirect = balanceResult.redirect;
                        return resultObj;
                    }
                    alert('Не удалось загрузить баланс. Обратитесь в поддержку');
                    console.log(balanceResult.response.message);
                    return resultObj;
                }
                resultObj.balance = balanceResult.response.balance.toString() + '$';
            } else {
                resultObj.error = true;
            }
        }
        return resultObj;
    }

    public static async updateBalance(): Promise<BalanceResponseType> {
        const resultObj: BalanceResponseType = {
            error: false,
            redirect: null,
            balance: null
        }
        const balanceElement: HTMLElement | null = document.getElementById('balance');
        const balanceInputElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('balance-input');
        const balanceValue: number = parseInt(balanceInputElement?.value as string);

        if (!balanceValue) {
            balanceInputElement.value = '0';
        }

        if (balanceValue !== parseInt(balanceElement?.innerText as string)) {
            const balanceUpdateResult: RequestResponseType | undefined = await RequestUtils.sendRequest('/balance', 'PUT', true, {
                newBalance: balanceValue
            });
            if (balanceUpdateResult) {
                if (balanceUpdateResult.error) {
                    resultObj.error = true;
                    if (balanceUpdateResult.response.error) {
                        alert('Не удалось обновить баланс. Обратитесь в поддержку');
                        console.log(balanceUpdateResult.response.message);
                    } else {
                        balanceUpdateResult.redirect ? resultObj.redirect = balanceUpdateResult.redirect : console.log('возникла какая-то ошибка');
                    }
                } else {
                    resultObj.balance = balanceUpdateResult.response.balance.toString() + '$';
                }
            } else {
                resultObj.error = true;
            }
        }
        return resultObj;
    }
}