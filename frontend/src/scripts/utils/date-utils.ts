export class DateUtils {
    public static formatDate(date: string, separator: string) {
        let dateParts: string[] | null = null;
        let newSeparator: string | null = null;
        let year: string | null = null;
        let month: string | null = null;
        let day: string | null = null;
        let newDate: string | null = null;
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
}
