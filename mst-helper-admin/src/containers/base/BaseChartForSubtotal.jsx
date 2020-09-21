import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/charts.css';
import echarts from 'echarts';
import { DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;

/**
 * 函数式组件示例，Hooks 和 自定义Hook 示例
 */


/**
 * 该组件没有做拆分复用，具体方法可参见 base 包下的可复用的基本组件 
 */

async function getOption(url, seriesName, roseType, showLabel) {
    let option = {};
    await axios({
        method: 'GET',
        url: url,
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((response) => {
        let data = response.data;
        //计算该图表中所有小计 总和
        let values = data.map((item) => { return Object.values(item) });
        let total = 0;
        let counts = values.map((item) => { return item[1] });
        counts.forEach((i) => {
            total += i
        })
        seriesName = seriesName + `\n\nTotal:  ${total}`;

        // console.log(data);
        option = {
            legend: {},
            tooltip: {},
            dataset: [{
                //注意维度名 如果和 data （对象数组） 对象的key 不同时，会出现问题, 可以直接使用索引
                // dimensions: [
                //     'date',
                //     'count',
                // ],
                // 提供一份数据。
                source: data
            }],
            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            xAxis: {
                type: 'category',
                gridIndex: 0,
                name: 'date',
                axisLabel: { rotate: 50, interval: data.length > 30 ? parseInt(data.length / 10) : null }
            },
            // 声明一个 Y 轴，数值轴。
            yAxis: {},
            //坐标轴底板 位置
            grid: [{ left: '40%', bottom: '20%' }],
            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
            backgroundColor: '#2c343c',
            series: [{
                name: seriesName,
                type: 'line',
                smooth: true,
                label: {
                    show: showLabel,
                },
                encode: {
                    x: 0,
                    y: 1,
                    tooltip: [1]
                }
            }, {
                type: 'pie',
                id: 'pie',
                radius: '50%',
                roseType: roseType,
                //饼图位置，以圆心为参考（左， 上）
                center: ['20%', '50%'],
                label: {
                    formatter: '{b} {d}% '
                },
                encode: {
                    itemName: seriesName,
                    value: 1,
                    tooltip: [1]
                }
            }

            ]
        };

    });
    // console.log(option);
    return option;
}

function useOption(id, url, seriesName, roseType, showLabel) {
    const obj = { dataset: [] };
    const [option, setOption] = useState(obj);
    //定义作用
    async function request() {
        // 等待异步方法执行完再set
        let option = await getOption(url, seriesName, roseType, showLabel);
        setOption(option);
    }
    //url 或 roseType变化一次触发一次作用
    useEffect(() => { request() }, [url, roseType, showLabel]);
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

    let opt = useOption(props.eleID, props.url, props.seriesName, roseType.type, showLabel.show);
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

