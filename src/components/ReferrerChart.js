// components/ReferrerChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const ReferrerChart = ({ data }) => {
  const referrerCounts = data.reduce((acc, referrer) => {
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {});

  const referrerData = Object.keys(referrerCounts).map(key => ({
    name: key,
    value: referrerCounts[key]
  }));

  const option = {
    title: {
      text: 'Top Referrers',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: referrerData.map(item => item.name),
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Referrers',
        type: 'bar',
        data: referrerData.map(item => item.value),
        itemStyle: {
          color: '#73c0de'
        }
      }
    ]
  };

  return (
    <div>
      <ReactEcharts option={option} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default ReferrerChart;
