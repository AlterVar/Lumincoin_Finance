import {CategoriesResponseType, RequestResponseType} from "../types/response.type";
import {RequestUtils} from "../utils/request-utils";
import {CategoriesType} from "../types/categories.type";

export class CategoriesService {
    public static async getCategories(type: string): Promise<CategoriesResponseType> {
        const returnObj: CategoriesResponseType = {
            error: false,
            redirect: null,
            categories: null
        }

        if (type) {
            let result: RequestResponseType = await RequestUtils.sendRequest('/categories/'+ type);

            if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
                returnObj.error = true;
                console.log(result.response.message);
                alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
                if (result.redirect) {
                    returnObj.redirect = result.redirect;
                }
                return returnObj;
            }
            if (result.response as CategoriesType) {
                returnObj.categories = result.response;
            }
            return returnObj;
        }
    }

    public static async loadCategory(type: string, id): Promise<CategoriesResponseType> {
        const returnObj: CategoriesResponseType = {
            error: false,
            redirect: null,
            categories: null
        }
        const result: RequestResponseType = await RequestUtils.sendRequest('/categories/' + type + '/' + id);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObj.error = true;
            console.log(result.response.message);
            alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        if (result.response as CategoriesType) {
            returnObj.categories = result.response;
        }
        return returnObj;
    }

    public static async createCategory(type: string, data): Promise<CategoriesResponseType> {
        const returnObj: CategoriesResponseType = {
            error: false,
            redirect: null,
            categories: null
        }
        const result: RequestResponseType = await RequestUtils.sendRequest('/categories/expense', 'POST', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObj.error = true;
            if (result.response.message !== 'This record already exists') {
                console.log(result.response.message);
                alert('Возникла ошибка при создании категории. Обратитесь в поддержку');
            }
            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        if (result.response as CategoriesType) {
            returnObj.categories = result.response;
        } else {
            returnObj.categories = result.response.message;
        }
        return returnObj;
    }

    public static async updateCategory(type: string, id: string, data): Promise<CategoriesResponseType> {
        const returnObj: CategoriesResponseType = {
            error: false,
            redirect: null,
            categories: null
        }
        const result: RequestResponseType = await RequestUtils.sendRequest('/categories/' + type + '/' + id, 'POST', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObj.error = true;
            if (result.response.message !== 'This record already exists') {
                console.log(result.response.message);
                alert('Возникла ошибка при создании категории. Обратитесь в поддержку');
            }
            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        if (result.response as CategoriesType) {
            returnObj.categories = result.response;
        } else {
            returnObj.categories = result.response.message;
        }
        return returnObj;
    }
}