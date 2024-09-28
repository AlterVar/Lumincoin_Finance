import {CommonUtils} from "./common-utils";
import config from "../config/config";
import {DateUtils} from "./date-utils";

export class FilterUtils {

    static activateFilter(currentFilter) {
        const filterButton = document.querySelectorAll('.filter-btn');
        const intervalElement = document.getElementById('interval-filter');
        for (let i = 0; i < filterButton.length; i++) {
            filterButton[i].classList.remove('active');
        }
        intervalElement.classList.remove('active');
        currentFilter.classList.add('active');
        return this.chooseFilter(currentFilter);
    }

    static chooseFilter(currentFilter) {
        const intervalFromElement = document.getElementById('interval-from');
        const intervalToElement = document.getElementById('interval-to');

        let filterType = CommonUtils.getFilterType(currentFilter.innerText);
        if (filterType === config.filterTypes.interval) {
            const dateFrom = intervalFromElement.innerText;
            const dateTo = intervalToElement.innerText;
            if (!dateFrom || dateFrom === 'Дата' || !dateTo || dateTo === 'Дата') {
                return;
            }
            filterType += '&&dateFrom=' + DateUtils.formatDate(dateFrom, '.') + '&dateTo=' + DateUtils.formatDate(dateTo, '.');
        } else {
            intervalFromElement.innerText = 'Дата';
            intervalToElement.innerText = 'Дата';
        }
        if (filterType === config.filterTypes.today) {
            const todayFrom = new Date();
            const dateFrom = (new Intl.DateTimeFormat("ru-RU").format(todayFrom)).toString()
            const todayTo = new Date();
            const dateTo = (new Intl.DateTimeFormat("ru-RU").format(todayTo)).toString()
            filterType = 'interval'+'&&dateFrom=' + DateUtils.formatDate(dateFrom, '.') + '&dateTo=' + DateUtils.formatDate(dateTo, '.');
        }
        return filterType;
    }
}