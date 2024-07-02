import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

const TopLocationsChart = ({ locations }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const filterLocationsForLastThreeMonths = (locations) => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return locations.filter(location => new Date(location.timestamp) >= threeMonthsAgo);
    };

    const locationData = filterLocationsForLastThreeMonths(locations);

    const locationCounts = locationData.reduce((acc, location) => {
      const key = `${location.city}, ${location.country}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    }, {});

    let formattedData = Object.keys(locationCounts).map(key => ({
      name: key,
      value: locationCounts[key]
    }));

    // Sort the data by value in descending order and slice the top 10
    formattedData = formattedData.sort((a, b) => b.value - a.value).slice(0, 10);

    setChartData(formattedData);
  }, [locations]);

  const option = {
    title: {
      text: 'Top Locations Over Time',
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
        name: 'Locations',
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
        data: chartData
      }
    ]
  };

  return (
    <div>
      <ReactEcharts option={option} style={{ height: '500px', width: '100%' }} />
    </div>
  );
};

export default TopLocationsChart;
