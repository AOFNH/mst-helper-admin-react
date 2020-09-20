import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/charts.css';
import echarts from 'echarts';
import { DatePicker , Button} from 'antd';
import SearchSelect from './SearchSelect';
import moment from 'moment';

const { RangePicker } = DatePicker;

/**
 * 函数式组件示例，Hooks 和 自定义Hook 示例
 */


/**
 * 该组件没有做拆分复用，具体方法可参见 base 包下的可复用的基本组件 
 */

async function getOption(url, seriesName, roseType) {
    let option = {};
    await axios({
        method: 'GET',
        url: url,
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((response) => {
        let data = response.data;
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

            series: [{
                name: seriesName,
                type: 'line',
                smooth: true,
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

function useOption(id, url, seriesName, roseType) {
    const obj = { dataset: [] };
    const [option, setOption] = useState(obj);
    //定义作用
    async function request() {
        // 等待异步方法执行完再set
        let option = await getOption(url, seriesName, roseType);
        setOption(option);
    }
    //url 变化一次触发一次作用
    useEffect(() => { request() }, [url, roseType]);
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



    //条件选择类型，用于确定条件栏类型
    let conditionType = props.conditionType;

    //获取 searchSelect 组件 默认值
    let defaultVal = parseInt(props.selectDefaultValue) === null ? 1 : parseInt(props.selectDefaultValue);

    /**
     * functionID
     */
    const [fcId, setFcId] = useState(defaultVal);
    //处理 选择框值变化后的事件，改变 fcId 状态值，触发chart 重载
    let handleChange = (value) => {
        setFcId(parseInt(value))
    }

    /**
     * timeRange
     */
    //日期格式
    const dateFormat = 'YYYY-MM-DD';
    let curDate = new Date();
    let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    let nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);

    const [dateRange, setDateRange] = useState({
        //dateString 
        startDate: moment((preDate), dateFormat).format(dateFormat),
        endDate: moment((nextDate), dateFormat).format(dateFormat)
    });
    const rangePickerHandleChange = (dates, dateStrings) => {
        setDateRange({
            startDate: dateStrings[0],
            endDate: dateStrings[1]
        });
    }


    /**
     * month
     */
    const monthFormat = 'YYYY-MM';
    // moment
    const defaultMonth = moment((new Date()), monthFormat);
    const [month, setMonth] = useState(defaultMonth.format(monthFormat));
    const monthPickerHandleChange = (date, dateString) => {
        setMonth(dateString)
    }

    /**
     * timeUnit
     */
    const [timeUnit, setTimeUnit] = useState('Y-m');
    const timeUnitHandleChange = (value) => {
        setTimeUnit(value)
    }


    /**
     * year
     */
    const yearFormat = 'YYYY';
    // moment
    const defaultYear = moment((new Date()), yearFormat);
    const [year, setYear] = useState(defaultYear.format(yearFormat));
    const yearPickerHandleChange = (date, dateString) => {
        setYear(dateString)
    }


    //生成 获取数据的 url ，并执行作用
    let fullURL = props.url + fcId;
    if (conditionType === 'timeRange') {
        fullURL = fullURL + '/' + dateRange.startDate + '/' + dateRange.endDate;
    } else if (conditionType === 'month') {
        fullURL = fullURL + '/' + month
    } else if (conditionType === 'timeUnit') {
        fullURL = fullURL + '/' + timeUnit;
    } else if (conditionType === 'year') {
        fullURL = fullURL + '/' + year;
    }
    let opt = useOption(props.eleID, fullURL, props.seriesName, roseType.type);
    useEffect(() => {
        addOption(props.eleID, opt);
    }, [props.eleID, opt, fcId, dateRange, month, timeUnit, year]);


    if (conditionType === 'functionID') {
        return (
            <div>
                <SearchSelect
                    detail={props.selectDetail}
                    onChange={handleChange}
                    value={fcId}
                    style={props.searchSelectStyle}
                />
                <Button type="primary" onClick={() => { changeRoseTypeHandler() }}>roseType : {roseType.text}</Button>
                <div
                    id={props.eleID}
                    className="chart-sm"
                    style={props.style}
                ></div>
            </div>
        )
    } else if (conditionType === 'timeRange') {
        return (
            <div>
                <SearchSelect
                    detail={props.selectDetail}
                    onChange={handleChange}
                    value={fcId}
                    style={props.searchSelectStyle}
                />
                <RangePicker
                    // showTime
                    defaultValue={[moment((preDate), dateFormat), moment((nextDate), dateFormat)]}
                    onChange={(dates, dateStrings) => { rangePickerHandleChange(dates, dateStrings) }}
                />
                <Button type="primary" onClick={() => { changeRoseTypeHandler() }}>roseType : {roseType.text}</Button>
                <div
                    id={props.eleID}
                    className="chart-sm"
                    style={props.style}
                ></div>
            </div>
        )
    } else if (conditionType === 'month') {
        return (
            <div>
                <SearchSelect
                    detail={props.selectDetail}
                    onChange={handleChange}
                    value={fcId}
                    style={props.searchSelectStyle}
                />
                <DatePicker
                    picker='month'
                    defaultValue={defaultMonth}
                    onChange={(date, dateString) => { monthPickerHandleChange(date, dateString) }}
                />
                <Button type="primary" onClick={() => { changeRoseTypeHandler() }}>roseType : {roseType.text}</Button>
                <div
                    id={props.eleID}
                    className="chart-sm"
                    style={props.style}
                ></div>
            </div>
        )
    } else if (conditionType === 'timeUnit') {
        return (
            <div>
                <SearchSelect
                    detail={props.selectDetail}
                    onChange={handleChange}
                    value={fcId}
                    style={props.searchSelectStyle}
                />
                <SearchSelect
                    detail={'timeUnit'}
                    onChange={timeUnitHandleChange}
                    value={timeUnit}
                    style={{ width: 200 }}
                />
                <Button type="primary" onClick={() => { changeRoseTypeHandler() }}>roseType : {roseType.text}</Button>
                <div
                    id={props.eleID}
                    className="chart-sm"
                    style={props.style}
                ></div>
            </div>
        )
    } else if (conditionType === 'year') {
        return (
            <div>
                <SearchSelect
                    detail={props.selectDetail}
                    onChange={handleChange}
                    value={fcId}
                    style={props.searchSelectStyle}
                />
                <DatePicker
                    picker='year'
                    defaultValue={defaultYear}
                    onChange={(date, dateString) => {
                        yearPickerHandleChange(date, dateString)
                    }}
                />
                <Button type="primary" onClick={() => { changeRoseTypeHandler() }}>roseType : {roseType.text}</Button>
                <div
                    id={props.eleID}
                    className="chart-sm"
                    style={props.style}
                ></div>
            </div>
        )
    }

}

