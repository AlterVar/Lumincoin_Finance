import {RequestUtils} from "./request-utils";
import {BalanceResponseType, RequestResponseType} from "../types/response.type";

export class BalanceUtils {

    public static async getBalance(): Promise<BalanceResponseType> {
        const resultObj: BalanceResponseType = {
            error: false,
            redirect: null,
            balance: null
        }
        //TODO: а сюда может приходить редирект?
        const balanceElement: HTMLElement | null = document.getElementById('balance');
        if (balanceElement) {
            const balanceResult: RequestResponseType = await RequestUtils.sendRequest('/balance', 'GET', true);
            if (balanceResult.error) {
                resultObj.error = true;
                if (balanceResult.response.error) {
                    alert('Не удалось загрузить баланс. Обратитесь в поддержку');
                    console.log(balanceResult.response.message);
                } else {
                    balanceResult.redirect ? resultObj.redirect = balanceResult.redirect : console.log('возникла какая-то ошибка');
                }
            } else {
                resultObj.balance = balanceResult.response.balance.toString() + '$';
            }
        }
        return resultObj;
    }

    //TODO: проверить, что приходит при обновлении, укладывается ли это в тип
    public static async updateBalance(): Promise<BalanceResponseType> {
        const resultObj: BalanceResponseType = {
            error: false,
            redirect: null,
            balance: null
        }
        const balanceElement: HTMLElement | null = document.getElementById('balance');
        const balanceInputElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('balance-input');
        const balanceValue: number = parseInt(balanceInputElement?.value as string);

        //TODO: убедиться, что всё правильно работает
        if (!balanceValue) {
            balanceInputElement.value = '0';
        }

        if (balanceValue !== parseInt(balanceElement?.innerText as string)) {
            const balanceUpdateResult: RequestResponseType = await RequestUtils.sendRequest('/balance', 'PUT', true, {
                newBalance: balanceValue
            });
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
        }
        return resultObj;
    }
}