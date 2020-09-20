import echarts from 'echarts';
// import ReactEcharts from 'echarts-for-react';
import React from 'react';
import axios from 'axios';
import '../assets/css/charts.css'


/**
 * 类组件示例
 */

class Chart1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {},
            // 指定图表的配置项和数据
            url: 'https://greasyfork.org/en/scripts/390978-%E4%BA%91%E7%8F%AD%E8%AF%BE%E9%AB%98%E6%95%88%E5%8A%A9%E6%89%8B/stats.json',
        }
    }

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'), 'dark');

        myChart.showLoading();

        axios.get(this.state.url).then(
            (response) => {
                let data = response.data;
                let data1 = Object.keys(data);
                let data2 = Object.values(data);
                // console.log(data2)
                let arr = [];
                for (let i = 0; i < data1.length; i++) {
                    let arr2 = [];
                    arr2.push(data1[i]);
                    arr2.push(data2[i].installs);
                    arr2.push(data2[i].update_checks);
                    arr.push(arr2);
                }

                var sizeValue = '57%';
                var symbolSize = 4;
                let option = {
                    legend: {},
                    tooltip: {},
                    dataZoom: [{
                        type: 'slider',
                        xAxisIndex: 3,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        xAxisIndex: 3,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'slider',
                        yAxisIndex: 3,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        yAxisIndex: 3,
                        start: 0,
                        end: 100
                    }
                    ],
                    grid: [
                        { right: sizeValue, bottom: sizeValue, name: 'Daily update checks' },
                        { left: sizeValue, bottom: sizeValue },
                        { right: sizeValue, top: sizeValue },
                        { left: sizeValue, top: sizeValue }
                    ],
                    xAxis: [
                        { type: 'category', gridIndex: 0, name: 'date', axisLabel: { rotate: 50, interval: 20 } },
                        { type: 'category', gridIndex: 1, name: 'date', boundaryGap: false, axisLabel: { rotate: 50, interval: 20 } },
                        { type: 'category', gridIndex: 2, name: 'date', axisLabel: { rotate: 50, interval: 20 } },
                        { type: 'category', gridIndex: 3, name: 'date', axisLabel: { rotate: 50, interval: 20 } }
                    ],
                    yAxis: [
                        { type: 'value', gridIndex: 0, name: 'installs' },
                        { type: 'value', gridIndex: 1, name: 'update_checks' },
                        { type: 'value', gridIndex: 2 },
                        { type: 'value', gridIndex: 3 }
                    ],
                    dataset: {
                        dimensions: [
                            'date',
                            'installs',
                            'update_checks',
                            // 'retentionRate'
                            // {name: 'update_checks', type: 'value'}
                        ],
                        source: arr,
                    },
                    series: [{
                        name: 'installs',
                        type: 'bar',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        encode: {
                            x: 0,
                            y: 1,
                            tooltip: [0, 1, 2]
                        }
                    },
                    {
                        name: 'update_checks',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        encode: {
                            x: 0,
                            y: 2,
                            tooltip: [0, 1, 2]
                        }
                    },
                    {
                        type: 'line',
                        smooth: true,
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        encode: {
                            x: 0,
                            y: 1,
                            tooltip: [0, 1, 2]
                        }
                    },
                    {
                        type: 'line',
                        smooth: true,
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        encode: {
                            x: 0,
                            y: 2,
                            tooltip: [0, 1, 2]
                        }
                    },
                    {
                        type: 'scatter',
                        symbolSize: symbolSize,
                        xAxisIndex: 3,
                        yAxisIndex: 3,
                        encode: {
                            x: 'date',
                            y: 'installs',
                            tooltip: [0, 1, 2]
                        }
                    },
                    {
                        type: 'scatter',
                        symbolSize: symbolSize,
                        xAxisIndex: 3,
                        yAxisIndex: 3,
                        encode: {
                            x: 'date',
                            y: 'update_checks',
                            tooltip: [0, 1, 2]
                        }
                    }
                    ]
                };

                myChart.hideLoading();

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        )
    }

    render() {
        return (
            <div id="main" className="chart"></div>
        )
    }

}

export default Chart1;