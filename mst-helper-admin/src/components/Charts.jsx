import Chart1 from '../containers/Chart1.jsx';
import React, { useContext, useState, useEffect } from 'react';
import '../assets/css/charts.css';
import Chart2 from '../containers/Chart2';
import Chart3 from '../containers/Chart3';
import AllFuncsByDate from '../containers/AllFuncsByDate';
import AllFuncsWithinRange from '../containers/AllFuncsWithinRange';
import SubtotalWithinRangeByTimeUnit from '../containers/SubtotalWithinRangeByTimeUnit';
import URLContext from '../state/context';
import { Layout, BackTop, Menu } from 'antd';
import 'antd/dist/antd.css';

const { Header, Sider, Content, Footer } = Layout;

/**
 * 组合使用各个小组件，构成一个完整的页面视图
 */

export default function Charts() {

    const [style, setStyle] = useState({});

    //用于绑定监听窗口变化的作用
    useEffect(() => {
        addScreenChange();
        return () => {
            // cleanup
            window.removeEventListener('resize', changeSize);
        }
    }, []);

    function addScreenChange() {
        window.addEventListener('resize', changeSize)
    }
    function changeSize() {
        // console.log('change')
    }

    //使用上下文对象
    const context = useContext(URLContext);
    const charts = context.charts;

    return (
        <Layout>
            <Layout>
                <Header>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <div className="charts">
                        <Chart1 />
                    </div>
                    <div className="charts">
                        <Chart2
                            eleID={charts.chart1.id}
                            url={charts.chart1.urlChart}
                            seriesName={charts.chart1.seriesName}
                            hideSelect={true}
                            selectDetail={'users'}
                        />
                        <AllFuncsByDate
                            eleID={charts.api8.id}
                            url={charts.api8.url}
                            seriesName={charts.api8.seriesName}
                        />
                        <AllFuncsWithinRange
                            eleID={charts.api9.id}
                            url={charts.api9.url}
                            seriesName={charts.api9.seriesName}
                        />
                        <Chart2
                            eleID={charts.chart2.id}
                            url={charts.chart2.urlChart}
                            seriesName={charts.chart2.seriesName}
                            selectDetail={'users'}
                            selectDefaultValue={0}
                        />
                        <SubtotalWithinRangeByTimeUnit
                            eleID={charts.api10.id}
                            url={charts.api10.url}
                            seriesName={charts.api10.seriesName}
                        />
                        <Chart3
                            eleID={charts.chart3.id}
                            url={charts.chart3.urlChart}
                            seriesName={charts.chart3.seriesName}
                            conditionType={charts.chart3.conditionType}

                            selectDetail={'allFunctions'}
                            selectDefaultValue={1}
                            searchSelectStyle={{ width: 250 }}
                        />
                        <Chart3
                            eleID={charts.chart4.id}
                            url={charts.chart4.urlChart}
                            seriesName={charts.chart4.seriesName}
                            conditionType={charts.chart4.conditionType}

                            selectDetail={'allFunctions'}
                            selectDefaultValue={1}
                            searchSelectStyle={{ width: 250 }}
                        />
                        <Chart3
                            eleID={charts.chart5.id}
                            url={charts.chart5.urlChart}
                            seriesName={charts.chart5.seriesName}
                            conditionType={charts.chart5.conditionType}

                            selectDetail={'allFunctions'}
                            selectDefaultValue={1}
                            searchSelectStyle={{ width: 250 }}
                        />
                        <Chart3
                            eleID={charts.chart6.id}
                            url={charts.chart6.urlChart}
                            seriesName={charts.chart6.seriesName}
                            conditionType={charts.chart6.conditionType}

                            selectDetail={'allFunctions'}
                            selectDefaultValue={1}
                            searchSelectStyle={{ width: 250 }}
                        />
                        <Chart3
                            eleID={charts.chart7.id}
                            url={charts.chart7.urlChart}
                            seriesName={charts.chart7.seriesName}
                            conditionType={charts.chart7.conditionType}

                            selectDetail={'allFunctions'}
                            selectDefaultValue={1}
                            searchSelectStyle={{ width: 250 }}
                        />
                    </div>
                </Content>
                <Footer style={{ background: 'black' }}></Footer>
            </Layout>
            <BackTop />
        </Layout>
    )
}