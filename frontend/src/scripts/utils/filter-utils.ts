import {CommonUtils} from "./common-utils";
import config from "../config/config";
import {DateUtils} from "./date-utils";

export class FilterUtils {

    public static activateFilter(currentFilter: HTMLElement): string {
        const filterButton: NodeList | null = document.querySelectorAll('.filter-btn');
        const intervalElement: HTMLElement | null = document.getElementById('interval-filter');
        for (let i = 0; i < filterButton.length; i++) {
            (filterButton[i] as HTMLElement).classList.remove('active');
        }
        intervalElement?.classList.remove('active');
        currentFilter.classList.add('active');
        return this.chooseFilter(currentFilter);
    }

    public static chooseFilter(currentFilter: HTMLElement): string {
        const intervalFromElement: HTMLElement | null = document.getElementById('interval-from');
        const intervalToElement: HTMLElement | null = document.getElementById('interval-to');

        let filterType: string = CommonUtils.getFilterType(currentFilter.innerText);
        if (intervalFromElement && intervalToElement) {
            if (filterType === config.filterTypes.interval) {
                const dateFrom: string = intervalFromElement.innerText;
                const dateTo: string = intervalToElement.innerText;
                if (dateFrom && dateFrom !== 'Дата' && dateTo && dateTo !== 'Дата') {
                    filterType += '&&dateFrom=' + DateUtils.formatDate(dateFrom, '.') + '&dateTo=' + DateUtils.formatDate(dateTo, '.');;
                }
            } else {
                intervalFromElement.innerText = 'Дата';
                intervalToElement.innerText = 'Дата';
            }
        }

        if (filterType === config.filterTypes.today) {
            const todayFrom: Date = new Date();
            const dateFrom: string = (new Intl.DateTimeFormat("ru-RU").format(todayFrom)).toString()
            const todayTo: Date = new Date();
            const dateTo: string = (new Intl.DateTimeFormat("ru-RU").format(todayTo)).toString()
            filterType = 'interval'+'&&dateFrom=' + DateUtils.formatDate(dateFrom, '.') + '&dateTo=' + DateUtils.formatDate(dateTo, '.');
        }
        return filterType;
    }
}