// components/TopLocationsChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const TopLocationsChart = ({ locations }) => {
  const filterLocationsForLastThreeMonths = (locations) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return locations.filter(location => new Date(location.timestamp) >= threeMonthsAgo);
  };

  const locationData = filterLocationsForLastThreeMonths(locations);

  const locationCountsByDate = locationData.reduce((acc, location) => {
    const date = new Date(location.timestamp).toLocaleDateString();
    const key = `${location.city}, ${location.country}`;
    if (!acc[date]) {
      acc[date] = {};
    }
    if (!acc[date][key]) {
      acc[date][key] = 0;
    }
    acc[date][key]++;
    return acc;
  }, {});

  const dates = Array.from(new Set(locationData.map(loc => new Date(loc.timestamp).toLocaleDateString()))).sort();
  const uniqueLocations = Array.from(new Set(locationData.map(loc => `${loc.city}, ${loc.country}`)));

  const series = uniqueLocations.map(location => ({
    name: location,
    type: 'line',
    data: dates.map(date => locationCountsByDate[date] ? locationCountsByDate[date][location] || 0 : 0)
  }));

  const option = {
    title: {
      text: 'Top Cities',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: uniqueLocations,
      bottom: 0
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series
  };

  return (
    <div>
      <ReactEcharts option={option} style={{ height: '20rem', width: '100%' }} />
    </div>
  );
};

export default TopLocationsChart;
