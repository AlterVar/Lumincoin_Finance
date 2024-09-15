import config from "../config/config";

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
                // year = parseInt(dateParts[0], 10);
                // month = parseInt(dateParts[1], 10) - 1;
                // day = parseInt(dateParts[2], 10);
                year = dateParts[0];
                month = dateParts[1];
                day = dateParts[2];
                newSeparator = '.'
                newDate = day+newSeparator+month+newSeparator+year;
                break;

            case '.':
                dateParts = date.split('.');
                // year = parseInt(dateParts[0], 10);
                // month = parseInt(dateParts[1], 10) - 1;
                // day = parseInt(dateParts[2], 10);
                year = dateParts[2];
                month = dateParts[1];
                day = dateParts[0];
                newSeparator = '-';
                newDate = year+newSeparator+month+newSeparator+day;

        }
        // let newDate = new Date(year, month, day);
        // return (new Intl.DateTimeFormat("ru-RU").format(newDate)).toString();
        return newDate;
    }

    //TODO datepicker
    static getDateRange () {
        
        // switch (e) {
        //     case e.target === '#interval-from-input':
        //         const dateFrom = document.getElementById('interval-from');
        //         const intervalFromInputElement = document.getElementById('interval-from-input');
        //         dateFrom.innerText = intervalFromInputElement.value;
        //         break;
        //     case 'to':
        //         const dateTo = document.getElementById('interval-to');
        //         const intervalToInputElement = document.getElementById('interval-to-input');
        //         dateTo.innerText = intervalToInputElement.value;
        //         break;
        // }
    }
}
