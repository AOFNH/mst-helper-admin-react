import React from 'react';
const base = 'https://mst.bellamy.top:8443';
const charts = {
    chart1: {
        id: 'c1',
        urlChart: base + '/hits/getAllFunctionsSubtotal',
        seriesName: 'all-Functions-Subtotal'
    },
    chart2: {
        id: 'c2',
        urlChart: base + '/hits/getAllFunctionsSubtotalByUserId/',
        seriesName: 'specified-User-Functions-Subtotal'
    },
    chart3: {
        id: 'c3',
        urlChart: base + '/hits/getDataByFuncID/',
        seriesName: 'specified-Function-Subtotal',
        conditionType: 'functionID'
    },
    chart4: {
        id: 'c4',
        urlChart: base + '/hits/getDataByFuncIdAndInterval/',  //{funcId}/{startDate}/{endDate}
        seriesName: 'specified-Function-Subtotal (Time Range)',
        conditionType: 'timeRange'
    },
    chart5: {
        id: 'c5',
        urlChart: base + '/hits/getDataByFuncIdAndMonth/', //{funcId}/{month}
        seriesName: 'specified-Function-Subtotal (specified Month)',
        conditionType: 'month'
    },
    chart6: {
        id: 'c6',
        urlChart: base + '/hits/getDataWithinByFuncIdAndTimeUnit/', //{funcId}/{timeUnit}
        seriesName: 'specified-Function-Subtotal (TimeUnit)',
        conditionType: 'timeUnit'
    },
    chart7: {
        id: 'c7',
        urlChart: base + '/hits/getMonthlyDataByFuncIdAndYear/',  //{funcId}/{year}
        seriesName: 'specified-Function-Subtotal (Year)',
        conditionType: 'year'
    },
    api8: {
        id: 'c8',
        url: base + '/hits/getAllFunctionsSubtotalByDate/',  //{date}
        seriesName: 'all-Functions-Subtotal (Date)',
    },
    api9: {
        id: 'c9',
        url: base + '/hits/getAllFunctionsSubtotalWithinRange/',  //{startDate}/{endDate}
        seriesName: 'all-Functions-Subtotal (DateRange)',
    },
    api10: {
        id: 'c10',
        url: base + '/hits/getSubtotalWithinRangeByTimeUnit/',  //{dateFormat}/{startDate}/{endDate}
        seriesName: 'Subtotal (TimeUnit)',
    },

};
const context = React.createContext({
    charts: charts,
});

export default context;
