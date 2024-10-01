import {RequestUtils} from "../utils/request-utils";
import {
    ErrorResponseType,
    OperationsResponseType,
    RequestResponseType
} from "../types/response.type";
import {OperationsType} from "../types/operations.type";

export class OperationsService {

    public static async getOperations(filter: string): Promise<OperationsResponseType> {
        const returnObj: OperationsResponseType = {
            error: false,
            redirect: null,
            operations: null
        }

        if (filter) {
            let result: RequestResponseType = await RequestUtils.sendRequest('/operations?period=' + filter);

            if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
                returnObj.error = true;
                console.log(result.response.message);
                alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
                if (result.redirect) {
                    returnObj.redirect = result.redirect;
                }
                return returnObj;
            }
            if (result.response as OperationsType) {
                returnObj.operations = result.response;
            }
        }
        return returnObj;
    }

    public static async getOperation(id: string): Promise<OperationsResponseType> {
        const returnObj: OperationsResponseType = {
            error: false,
            redirect: null,
            operations: null
        }

        let result: RequestResponseType = await RequestUtils.sendRequest('/operations/' + id);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObj.error = true;
            console.log(result.response.message);
            alert('Возникла ошибка при создании операции. Обратитесь в поддержку');
            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        if (result.response as OperationsType) {
            returnObj.operations = result.response;
        }
        return returnObj;
    }

    public static async createOperation(data: OperationsType): Promise<OperationsResponseType> {
        const returnObj: OperationsResponseType = {
            error: false,
            redirect: null,
            operations: null
        }
        let result: RequestResponseType = await RequestUtils.sendRequest('/operations', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObj.error = true;
            console.log(result.response.message);
            alert('Возникла ошибка при создании операции. Обратитесь в поддержку');
            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        if (result.response as OperationsType) {
            returnObj.operations = result.response;
        }
        return returnObj;
    }

    public static async updateOperation(id: string, data: OperationsType): Promise<OperationsResponseType> {
        const returnObj: OperationsResponseType = {
            error: false,
            redirect: null,
            operations: null
        }
        let result: RequestResponseType = await RequestUtils.sendRequest('/operations/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObj.error = true;
            console.log(result.response.message);
            alert('Возникла ошибка при обновлении операции. Обратитесь в поддержку');
            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        if (result.response as OperationsType) {
            returnObj.operations = result.response;
        }
        return returnObj;
    }

    public static async deleteOperations(id: string): Promise<OperationsResponseType> {
        const returnObj: OperationsResponseType = {
            error: false,
            redirect: null,
            operations: null
        }
        let result: RequestResponseType = await RequestUtils.sendRequest('/operations/' + id, 'DELETE');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObj.error = true;
            console.log(result.response.message);
            alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        if (result.response as OperationsType) {
            returnObj.operations = result.response;
        }
        return returnObj;
    }
}