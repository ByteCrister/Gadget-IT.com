// MyChart.js
import React, { useContext } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { useData } from '../../context/useData';

const { CanvasJSChart } = CanvasJSReact;

const MyChart = () => {
  const { dataState } = useContext(useData);

  const options = {
    animationEnabled: true,
    title: {
      text: "Sales Data"
    },
    data: [
      {
        type: "column", //change type to "bar" for a bar chart
        dataPoints: dataState?.Dashboard_Page?.chart.map((item) => { return { label: item.month_name, y: item.order_count } })
        // dataPoints: [
        //   { label: "January", y: 65 },
        //   { label: "February", y: 59 },
        //   { label: "March", y: 80 },
        //   { label: "April", y: 81 },
        //   { label: "May", y: 56 },
        //   { label: "June", y: 55 }
        // ]
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {dataState?.Dashboard_Page?.chart && <CanvasJSChart options={options} />}
    </div>
  );
};

export default React.memo(MyChart);
