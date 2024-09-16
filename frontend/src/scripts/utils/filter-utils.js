import {CommonUtils} from "./common-utils";
import config from "../config/config";
import {DateUtils} from "./date-utils";

export class FilterUtils {

    static activateFilter(currentFilter) {
        this.filterButton = document.querySelectorAll('.filter-btn');
        for (let i = 0; i < this.filterButton.length; i++) {
            this.filterButton[i].classList.remove('active');
        }
        currentFilter.classList.add('active');
        return this.chooseFilter(currentFilter);
    }

    static chooseFilter(currentFilter) {
        this.intervalFromElement = document.getElementById('interval-from');
        this.intervalToElement = document.getElementById('interval-to');

        let filterType = CommonUtils.getFilterType(currentFilter.innerText);
        if (filterType === config.filterTypes.interval) {
            const dateFrom = this.intervalFromElement.innerText;
            const dateTo = this.intervalToElement.innerText;
            if (!dateFrom || dateFrom === 'Дата' || !dateTo || dateTo === 'Дата') {
                return;
            }
            filterType += '&&dateFrom=' + DateUtils.formatDate(dateFrom, '.') + '&dateTo=' + DateUtils.formatDate(dateTo, '.');
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