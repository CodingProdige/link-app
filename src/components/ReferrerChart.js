import React from 'react';
import ReactEcharts from 'echarts-for-react';

const ReferrerChart = ({ data }) => {
  const referrerCounts = data.reduce((acc, referrerObj) => {
    const referrer = referrerObj.referer;
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {});

  let referrerData = Object.keys(referrerCounts).map(key => ({
    name: key,
    value: referrerCounts[key]
  }));

  // Sort the data by value in descending order and slice the top 10
  referrerData = referrerData.sort((a, b) => b.value - a.value).slice(0, 10);

  const option = {
    title: {
      text: 'Top Referrers',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      left: 'left'
    },
    series: [
      {
        name: 'Referrers',
        type: 'pie',
        radius: ['30%', '70%'], // Adjust the inner and outer radius to create a ring
        roseType: 'radius', // Makes the pie chart a rose chart
        itemStyle: {
          borderRadius: 8, // Add rounded corners
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)'
        },
        data: referrerData
      }
    ]
  };

  return (
    <div>
      <ReactEcharts option={option} style={{ height: '30rem', width: '100%' }} />
    </div>
  );
};

export default ReferrerChart;
