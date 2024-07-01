// components/DailyVisitorChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const DailyVisitorChart = ({ visits }) => {
  const filterVisitsForLastThreeMonths = (visits) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return visits.filter(visit => new Date(visit.timestamp) >= threeMonthsAgo);
  };

  const prepareChartData = (visits) => {
    const filteredVisits = filterVisitsForLastThreeMonths(visits);
    const dates = filteredVisits.map(visit => new Date(visit.timestamp).toLocaleDateString());
    const uniqueDates = Array.from(new Set(dates));

    const visitCounts = uniqueDates.map(date => ({
      date,
      count: filteredVisits.filter(visit => new Date(visit.timestamp).toLocaleDateString() === date).length,
    }));

    return {
      dates: visitCounts.map(item => item.date),
      counts: visitCounts.map(item => item.count)
    };
  };

  const chartData = prepareChartData(visits);

  const option = {
    title: {
      text: 'Daily Visitors',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Visits',
        type: 'line',
        data: chartData.counts,
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

export default DailyVisitorChart;
