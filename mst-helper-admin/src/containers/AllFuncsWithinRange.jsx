import React, { useState } from 'react';
import { DatePicker ,Button} from 'antd';
import moment from 'moment';
import AllFuncsChart from './base/BaseChartForAllFuncs';

const { RangePicker } = DatePicker;

export default (props) => {

    let fullURL = '';
    const dateFormat = 'YYYY-MM-DD';
    let curDate = new Date();
    let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    let nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);
    // moment
    const defaultDate = moment((new Date()), dateFormat);
    const [dateRange, setDateRange] = useState({
        startDate: moment(preDate, dateFormat),
        endDate: moment(nextDate, dateFormat)
    });
    const handleChange = (dates, dateStrings) => {
        console.log(dates)
        setDateRange({
            startDate: dates[0],
            endDate: dates[1]
        });
    };

    //是否包含其他日期统计总数 0：否 ， 1：是
    const [doShow, setDoShow] = useState({
        show: 0,
        text: 'show others'
    });
    const handleClick = (e)=>{
        if(doShow.show === 0){
            setDoShow({
                show: 1,
                text: 'hide others'
            });
        }else{
            setDoShow({
                show: 0,
                text: 'show others'
            });
        }
    }

    fullURL = props.url + doShow.show
        + '/' +dateRange.startDate.format(dateFormat)
        + '/' + dateRange.endDate.format(dateFormat);

    return (
        <div>
            <RangePicker
                // showTime
                defaultValue={[dateRange.startDate, dateRange.endDate]}
                onChange={(dates, dateStrings) => { handleChange(dates, dateStrings) }}
            />
            <Button type="primary" onClick={(e)=>{handleClick(e)}}>{doShow.text}</Button>
            <AllFuncsChart
                eleID={props.eleID}
                url={fullURL}
                seriesName={props.seriesName}
            />
        </div>
    );
}


