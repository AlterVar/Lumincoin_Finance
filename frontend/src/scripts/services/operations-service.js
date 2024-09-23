import {RequestUtils} from "../utils/request-utils";

export class OperationsService {

    //TODO: переписать все запросы в сервисы, раз уж он все равно понадобился
    static async getOperations(filter) {
        const returnObj = {
            error: false,
            redirect: null,
            operations: null
        }

        if (filter) {
            let result = await RequestUtils.sendRequest('/operations?period=' + filter);

            if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
                returnObj.error = ('Возникла ошибка при запросе операций. Обратитесь в поддержку');
                if (result.redirect) {
                    returnObj.redirect = result.redirect;
                }
                return returnObj;
            }

            returnObj.operations = result.response;
            return returnObj;
        }
    }
}