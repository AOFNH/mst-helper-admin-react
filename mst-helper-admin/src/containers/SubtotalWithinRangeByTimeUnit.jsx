import React, { useState, useEffect } from 'react';
import { DatePicker, Select } from 'antd';
import BaseChartForSubtotal from './base/BaseChartForSubtotal';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;

export default (props) => {

    //选择 时间粒度， 粒度的改变 会改变 RangePicker 的类型
    const [selectValue, setSelectValue] = useState('Y-m-d');
    const selectHandler = (value) => {
        setSelectValue(value)
    }

    //用于生成默认日期范围
    const dateFormat = 'YYYY-MM-DD';
    let curDate = new Date();
    //项目部署日期前的某个日期
    const releaseDate = '2020-09-01';
    let perDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    let nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);

    const [dateRange, setDateRange] = useState({
        startDate :  moment(new Date(releaseDate), dateFormat).format(dateFormat),
        endDate : moment(nextDate, dateFormat).format(dateFormat)
    })
    const RangePickerHandler = (dates, dateStrings) => {

        // 后端要求日期格式必须满足 YYYY-MM-DD 
        let newDateStrings = dates.map((item)=>{
            return item.format(dateFormat)
        })
        setDateRange({
            startDate: newDateStrings[0],
            endDate: newDateStrings[1]
        })
    }
    
    // pickerType : date , week , month , year
    const [pickerType, setPickerType] = useState('date');
    const changePickerType = (value) => {
        if (value === 'Y-m-d') {
            setPickerType('date')
        } else if (value === 'Y-u') {
            setPickerType('week')
        } else if (value === 'Y-m') {
            setPickerType('month')
        } else if (value === 'Y') {
            setPickerType('year')
        }
    }
    //时间粒度的改变，会导致RangePicker 类型的改变， 给selectValue 绑定作用
    useEffect(() => {
        changePickerType(selectValue)
    }, [selectValue]);

    //生成 完整的 url
    let  fullURL = props.url + selectValue 
                    + '/' + dateRange.startDate
                    + '/' + dateRange.endDate;

    return (
        <div>
            <Select defaultValue={selectValue} onChange={selectHandler}>
                <Option value="Y-m-d">Date</Option>
                <Option value="Y-u">Week</Option>
                <Option value="Y-m">Month</Option>
                <Option value="Y">Year</Option>
            </Select>
            <RangePicker
                picker={pickerType}
                defaultValue={[moment(new Date(releaseDate), dateFormat), moment(nextDate, dateFormat)]}
                onChange={(dates, dateStrings) => { RangePickerHandler(dates, dateStrings) }}
            />
            <BaseChartForSubtotal
                eleID={props.eleID}
                url={fullURL}
                seriesName={props.seriesName}
            />
        </div>
    )
}
