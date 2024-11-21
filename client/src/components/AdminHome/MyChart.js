// MyChart.js
import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const { CanvasJSChart } = CanvasJSReact;

const MyChart = () => {
  const options = {
    animationEnabled: true,
    title: {
      text: "Sales Data"
    },
    data: [
      {
        type: "column", //change type to "bar" for a bar chart
        dataPoints: [
          { label: "January", y: 65 },
          { label: "February", y: 59 },
          { label: "March", y: 80 },
          { label: "April", y: 81 },
          { label: "May", y: 56 },
          { label: "June", y: 55 }
        ]
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default React.memo(MyChart);
