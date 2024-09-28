import Datepicker from "../datepicker";
import {OperationsService} from "../services/operations-service";
import {FilterUtils} from "./filter-utils";

export class DateUtils {
    static formatDate(date, separator) {
        let dateParts = null;
        let newSeparator = null;
        let year = null;
        let month = null;
        let day = null;
        let newDate = null;
        switch (separator) {
            case '-':
                dateParts = date.split('-');
                year = dateParts[0];
                month = dateParts[1];
                day = dateParts[2];
                newSeparator = '.'
                newDate = day+newSeparator+month+newSeparator+year;
                break;

            case '.':
                dateParts = date.split('.');
                year = dateParts[2];
                month = dateParts[1];
                day = dateParts[0];
                newSeparator = '-';
                newDate = year+newSeparator+month+newSeparator+day;
        }
        return newDate;
    }

    static getDateFromPicker(fromElement, toElement) {
        if (fromElement && fromElement.getAttribute('data-value')) {
            fromElement.innerText = fromElement.getAttribute('data-value');
        }
        if (toElement && toElement.getAttribute('data-value')) {
            toElement.innerText = toElement.getAttribute('data-value');
        }
    }
}
