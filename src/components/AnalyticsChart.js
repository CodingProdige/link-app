// components/AnalyticsChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const AnalyticsChart = ({ data }) => {
  const option = {
    title: {
      text: 'Analytics Overview',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Visits', 'Clicks', 'Hovers'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.titles
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Visits',
        type: 'line',
        data: data.visits,
        areaStyle: {}
      },
      {
        name: 'Clicks',
        type: 'line',
        data: data.clicks,
        areaStyle: {}
      },
      {
        name: 'Hovers',
        type: 'line',
        data: data.hovers,
        areaStyle: {}
      }
    ]
  };

  return (
    <div>
      <h2>Analytics Overview</h2>
      <ReactEcharts option={option} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default AnalyticsChart;
