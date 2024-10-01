const host: string | undefined = process.env.HOST;

const config: any = {
    host: host,
    api: host + '/api',
    operationTypes: {
        expense: 'expense',
        income: 'income'
    },
    filterTypes: {
        today: 'today',
        week: 'week',
        month: 'month',
        year: 'year',
        all: 'all',
        interval: 'interval',
    }
}

export default config;
