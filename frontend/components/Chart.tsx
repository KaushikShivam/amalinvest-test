import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

interface ChartProps {
  performanceData: number[][];
}

const Chart: React.FC<ChartProps> = ({ performanceData }) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"stockChart"}
      options={{
        title: {
          text: "Portfolio Performance",
        },
        series: [
          {
            name: "Portfolio",
            data: performanceData,
            tooltip: {
              valueDecimals: 2,
            },
          },
        ],
      }}
    />
  );
};

export default Chart;
