import {RequestUtils} from "../../utils/request-utils";

export class OperationsDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            return this.openNewRoute('/')
        }

        this.deleteOperation(id);
    }

    async deleteOperation(id) {
        const deleteResult = await RequestUtils.sendRequest('/operations/' + id, 'DELETE');
        if (deleteResult.error || !deleteResult.response) {
            console.log(error)
        }
        this.openNewRoute('/operations');
    }
}