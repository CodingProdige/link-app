// components/DeviceTypeChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const DeviceTypeChart = ({ visits }) => {
  const filterVisitsForLastThreeMonths = (visits) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return visits.filter(visit => new Date(visit.timestamp) >= threeMonthsAgo);
  };

  const visitsData = filterVisitsForLastThreeMonths(visits);

  const dates = visitsData.map(visit => new Date(visit.timestamp).toLocaleDateString());
  const uniqueDates = Array.from(new Set(dates));

  const mobileVisitsByDate = uniqueDates.map(date => ({
    date,
    count: visitsData.filter(visit => visit.deviceType === 'mobile' && new Date(visit.timestamp).toLocaleDateString() === date).length,
  }));

  const desktopVisitsByDate = uniqueDates.map(date => ({
    date,
    count: visitsData.filter(visit => visit.deviceType === 'desktop' && new Date(visit.timestamp).toLocaleDateString() === date).length,
  }));

  const option = {
    title: {
      text: 'Visits Device Type',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Mobile', 'Desktop'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: uniqueDates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Mobile',
        type: 'line',
        data: mobileVisitsByDate.map(item => item.count),
        areaStyle: {}
      },
      {
        name: 'Desktop',
        type: 'line',
        data: desktopVisitsByDate.map(item => item.count),
        areaStyle: {}
      }
    ]
  };

  return (
    <div>
      <ReactEcharts option={option} style={{ height: '20rem', width: '100%' }} />
    </div>
  );
};

export default DeviceTypeChart;
