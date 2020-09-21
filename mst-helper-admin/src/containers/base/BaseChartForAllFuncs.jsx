import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/charts.css';
import echarts from 'echarts';
import { Button } from 'antd'

/**
 * 该组件只和图表样式相关（用于展示所有功能使用量的图表）
 * 所有用于图表展示的数据的获取均需要由调用者提供参数
 * 
 * 其他用于筛选数据的组合组件（这些组合组件不可复用），应该与本基本组件分离
 *
 */

/* 请求数据，返回值会用做 状态 */
async function getOption(url, seriesName, roseType, showLabel) {
    let option = {};
    await axios({
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((response) => {
        let data = response.data;
        // console.log(data);
        //计算该图表中所有小计 总和
        let values = data.map((item) => { return Object.values(item) });
        let total = 0;
        let counts = values.map((item) => { return item[1] });
        counts.forEach((i) => {
            total += i
        })
        seriesName = seriesName + `\n\nTotal:  ${total}`;

        option = {
            legend: {},
            tooltip: {},
            dataset: [{
                dimensions: [
                    'funcName',
                    'count',
                    'proportion'
                ],
                // 提供一份数据。
                source: data
            }],
            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            xAxis: {
                type: 'category',
                axisLabel: { rotate: 50, interval: 0 }
            },
            // 声明一个 Y 轴，数值轴。
            yAxis: {},
            //坐标轴底板 位置
            grid: { right: '40%', bottom: '30%' },
            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
            // visualMap: {
            //     show: true,
            //     min: 80,
            //     max: 600,
            //     inRange: {
            //         colorLightness: [0, 1]
            //     }
            // },
            backgroundColor: '#2c343c',
            series: [{
                name: seriesName,
                type: 'bar',
                label: {
                    show: showLabel,
                },
                encode: {
                    x: 'funcName',
                    y: 'count',
                    tooltip: [0, 1, 2]
                }
            }, {
                type: 'pie',
                id: 'pie',
                radius: '50%',
                //饼图位置，以圆心为参考（左， 上）
                center: ['80%', '50%'],
                label: {
                    formatter: '{b} {d}%'
                },
                //南丁格尔图
                roseType: roseType,
                // label: {
                //     normal: {
                //         textStyle: {
                //             color: 'rgba(255, 255, 255, 0.3)'
                //         }
                //     }
                // },
                // labelLine: {
                //     normal: {
                //         lineStyle: {
                //             color: 'rgba(255, 255, 255, 0.3)'
                //         }
                //     }
                // },
                // itemStyle: {
                //     normal: {
                //         color: '#c23531',
                //         shadowBlur: 200,
                //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                //     }
                // },
                encode: {
                    itemName: seriesName,
                    value: 'count',
                    tooltip: [0, 1, 2]
                }
            }

            ]
        };
    })
    //返回状态
    return option;
}

/* 自封装HOOK, 使用状态 */
function useOption(url, seriesName, roseType, showLabel) {

    // let seriesName = 'allFunctionsSubtotal';
    // let url = urlChart1;
    const obj = { dataset: [] };
    const [option, setOption] = useState(obj);
    //定义作用
    async function request() {
        // 等待异步方法执行完再set
        let option = await getOption(url, seriesName, roseType, showLabel);
        setOption(option);
    }
    // 该作用 依赖于 url, roseType (roseType 每次点击都会触发)
    useEffect(() => {
        request()
    }, [url, roseType, showLabel]);
    //返回状态
    return option;
}

function addOption(id, option) {
    //设置chart option
    let myChart = echarts.init(document.getElementById(id), 'dark');
    myChart.showLoading();
    if (option.dataset.length !== 0) {
        myChart.setOption(option);
        myChart.hideLoading();
    }
}

export default (props) => {
    /**
     * 南丁格尔图属于图表样式，所以应该定义在本基本图表组件中
     */
    //用于切换饼状图样式（roseType : 指定南丁格尔图类型  radius , area） 
    const [roseType, setRoseType] = useState({
        id: 1,
        type: 'radius',
        text: 'radius'
    });
    const changeRoseTypeHandler = () => {
        let id = roseType.id > 2 ? 0 : roseType.id;
        id++;
        id = id > 2 ? 0 : id;
        let type = id === 0 ? '' : (id === 1 ? 'radius' : 'area');
        let text = type.length === 0 ? 'none' : type;

        setRoseType({
            id: id,
            type: type,
            text: text
        })
    }

    //控制是否展示 各条目标签
    const [showLabel, setShowLabel] = useState({
        show: false,
        text: 'Show Label'
    });
    const showLabelHandler = () => {
        let show = showLabel.show;
        setShowLabel({
            show: !show,
            text: !show ? 'Hide Label' : 'Show Label'
        })
    }

    //获取并使用状态，只要状态改变，（初始值 => 被赋新值），组件被render
    //这里opt 经历由  {} 到 被赋值远程获取的值
    const opt = useOption(props.url, props.seriesName, roseType.type, showLabel.show);
    //设置依赖于 opt 状态的作用，只要状态改变，则执行
    useEffect(() => {
        addOption(props.eleID, opt);
    }, [props.eleID, opt]);

    return (
        <div>
            <Button
                type="primary"
                onClick={() => { changeRoseTypeHandler() }}
                shape="round"
            >roseType : {roseType.text}</Button>
            <Button
                type="primary"
                onClick={() => { showLabelHandler() }}
                shape="round"
            >{showLabel.text}</Button>
            <div id={props.eleID} className="chart-sm" style={props.style}></div>
        </div>
    )
}
