import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

/**
 * 函数式组件示例，Hooks 和 自定义Hook 示例
 */

/**
 * 根据指定信息获取对应的所有选项
 * 生成可搜索的选择器
 * 
 * @param {*} detail 
 */
async function getOptionsVal(detail) {

    let options = [];
    if (detail === 'allFunctions') {
        for (let i = 0; i < 30; i++) {
            options.push({ value: i, text: i })
        }
    } else if (detail === 'users') {
        options = [
            { value: 0, text: 0 },
            { value: 1, text: 1 }
        ]
    } else if (detail === 'timeUnit') {
        options = [
            { value: 'Y', text: 'Year' },
            { value: 'Y-m', text: 'Month' },
            { value: 'Y-u', text: 'Week' },
            { value: 'Y-m-d', text: 'Day' }
        ]
    }
    return options;

}

function useOptionVal(detail) {
    const [values, setValues] = useState([]);
    useEffect(() => {
        effect()
    }, [detail]);
    async function effect() {
        let vals = await getOptionsVal(detail);
        setValues(vals)
    }
    return values;
}

export default (props) => {
    //detail 表示 select option 的内容
    let options = useOptionVal(props.detail);
    const children = options.map((item) => {
        return (
            <Option key={item.value}>{item.text}</Option>
        )
    })

    if (options.length === 0) {
        return <div>Loading...</div>
    }
    return (
        <Select
            showSearch
            value={props.value}
            onChange={props.onChange}
            style={props.style === undefined ? { width: 200 } : props.style}
        >
            {children}
        </Select>
    )
}
