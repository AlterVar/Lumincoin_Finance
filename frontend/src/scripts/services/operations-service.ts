import {RequestUtils} from "../utils/request-utils";
import {
    ErrorResponseType,
    OperationsResponseType,
    RequestResponseType
} from "../types/response.type";
import {OperationsType} from "../types/operations.type";

export class OperationsService {

    public static async getOperations(filter): Promise<OperationsResponseType> {
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
            return returnObj;
        }
    }
}