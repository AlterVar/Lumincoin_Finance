import Datepicker from "../datepicker";

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

    //Datepicker
    static activateDatePickers (fromElement, toElement) {
        const that = this;
        new Datepicker(fromElement, {
            onChange: function () {
                that.getDateFromPicker(fromElement, null)
            }
        });

        new Datepicker(toElement, {
            onChange: function () {
                that.getDateFromPicker(null, toElement)
            }
        });
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
