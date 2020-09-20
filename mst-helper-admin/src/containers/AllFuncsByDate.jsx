import React, { useState } from 'react';
import { DatePicker , Button} from 'antd';
import moment from 'moment';
import AllFuncsChart from './base/BaseChartForAllFuncs';

export default (props) => {

    let fullURL = '';
    const dateFormat = 'YYYY-MM-DD';
    // moment
    const defaultDate = moment((new Date()), dateFormat);
    const [date, setDate] = useState(defaultDate.format(dateFormat));
    const handleChange = (date, dateString) => {
        setDate(dateString);
    }
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
    fullURL = props.url+ doShow.show + '/' + date;
    return (
        <div>
            <DatePicker
                size={'middle'}
                onChange={(date, dateString) => {
                    handleChange(date, dateString)
                }}
                defaultValue={defaultDate}
            />
            <Button type="primary" onClick={()=>{handleClick()}}>{doShow.text}</Button>
            <AllFuncsChart
                eleID={props.eleID}
                url={fullURL}
                seriesName={props.seriesName}
            />
        </div> 
    );
}


