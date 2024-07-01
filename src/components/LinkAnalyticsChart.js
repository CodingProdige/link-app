// components/LinkAnalyticsChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const LinkAnalyticsChart = ({ link }) => {
  const prepareChartData = (events) => {
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.timestamp);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return eventDate >= threeMonthsAgo;
    });

    const dates = filteredEvents.map(event => new Date(event.timestamp).toLocaleDateString());
    const uniqueDates = Array.from(new Set(dates));

    const clickCounts = uniqueDates.map(date => ({
      date,
      count: filteredEvents.filter(event => event.type === 'click' && new Date(event.timestamp).toLocaleDateString() === date).length,
    }));

    const hoverCounts = uniqueDates.map(date => ({
      date,
      count: filteredEvents.filter(event => event.type === 'hover' && new Date(event.timestamp).toLocaleDateString() === date).length,
    }));

    return {
      dates: uniqueDates,
      clicks: clickCounts.map(item => item.count),
      hovers: hoverCounts.map(item => item.count),
    };
  };

  const chartData = prepareChartData(link.events);

  const option = {
    // title: {
    //   text: `${link.title || `Link ${link.id}`} Analytics`,
    //   left: 'left',
    // },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Clicks', 'Hovers'],
      bottom: 0
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
        name: 'Clicks',
        type: 'line',
        data: chartData.clicks,
        areaStyle: {}
      },
      {
        name: 'Hovers',
        type: 'line',
        data: chartData.hovers,
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

export default LinkAnalyticsChart;
