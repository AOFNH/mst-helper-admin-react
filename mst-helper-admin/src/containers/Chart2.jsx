import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/charts.css';
import echarts from 'echarts';
import SearchSelect from './SearchSelect';
import {Button} from 'antd';

/**
 * 函数式组件示例，Hooks 和 自定义Hook 示例
 */


/* 请求数据，返回值会用做 状态 */
async function getOption(url, seriesName, roseType) {
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

            series: [{
                name: seriesName,
                type: 'bar',
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
                roseType: roseType,
                label: {
                    formatter: '{b} {d}%'
                },
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
function useOption(id, url, seriesName, roseType) {

    // let seriesName = 'allFunctionsSubtotal';
    // let url = urlChart1;
    const obj = { dataset: [] };
    const [option, setOption] = useState(obj);
    //定义作用
    async function request() {
        // 等待异步方法执行完再set
        let option = await getOption(url, seriesName, roseType);
        setOption(option);

        // addOption(id, option);  

        // //设置chart option
        // let myChart = echarts.init(document.getElementById('chart2'), 'dark');
        // myChart.showLoading();
        // myChart.setOption(option);
        // myChart.hideLoading();
    }
    //执行一次作用
    useEffect(() => {
        request()
    }, [url, roseType]);
    // console.log('111')
    // console.log(option)
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

    //获取 选择器 默认值
    let defVal = props.selectDefaultValue;
    let defaultVal = defVal === undefined || isNaN(parseInt(defVal)) ? 0 : parseInt(defVal);
    const [usrId, setUsrId] = useState(defaultVal);
    //处理 选择框值变化后的事件，改变 状态值，触发chart 重载
    let handleChange = (value) => {
        setUsrId(parseInt(value))
    }

    //获取并使用状态，只要状态改变，（初始值 => 被赋新值），组件被render
    //这里opt 经历由  {} 到 被赋值远程获取的值
    //fullURL 会由于 usrId 改变而改变，每次改变都会重新获取 opt
    let fullURL = props.hideSelect ? props.url : props.url + usrId;
    // console.log(fullURL)
    const opt = useOption(props.eleID, fullURL, props.seriesName, roseType.type);
    //设置依赖于 opt 状态的作用，只要状态改变，则执行
    useEffect(() => {
        addOption(props.eleID, opt);
    }, [props.eleID, opt, usrId]);

    if (props.hideSelect) {
        return (
            <div>
                <Button type="primary" onClick={() => { changeRoseTypeHandler() }}>roseType : {roseType.text}</Button>
                <div id={props.eleID} className="chart-sm" style={props.style}></div>
            </div>
        )
    } else {
        return (
            <div>
                <SearchSelect
                    detail={props.selectDetail}
                    onChange={handleChange}
                    value={usrId}
                    style={props.searchSelectStyle}
                />
                <Button type="primary" onClick={() => { changeRoseTypeHandler() }}>roseType : {roseType.text}</Button>
                <div id={props.eleID} className="chart-sm" style={props.style}></div>
            </div>
        )
    }
}
