import ChartJsImage from 'chartjs-to-image';

export const chartOptions = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: '-',
        borderColor: '#ff4dd2',
        // borderColor: '#ad16db',
        borderWidth: 15,
        backgroundColor: 'rgba(255,+99,+132,+.5)',
        data: [],
      },
    ],
  },
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    chartArea: {
      backgroundColor: 'rgba(255,+99,+132,0)',
    },
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: '',
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: false,
          },
          gridLines: {
            display: false,
            color: 'rgba(0, 0, 0, 0)',
            gridLines: {
              drawOnChartArea: false,
            },
          },
          ticks: {
            display: false,
            autoSkip: true,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: false,
            labelString: 'Value in USD',
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
            display: false,
            gridLines: {
              drawOnChartArea: false,
            },
          },
          ticks: {
            display: false,
            autoSkip: true,
          },
        },
      ],
      y: [],
      x: [],
    },
  },
};

export const generateChart = (height, width, chartData) => {
  let chartDataArray = chartData;
  const myChart = new ChartJsImage();
  let shrinkedData = chartDataArray;
  while (shrinkedData.length >= 60) {
    chartDataArray = shrinkedData;
    shrinkedData = [];
    for (let i = 0; i < chartDataArray.length; i += 2) {
      shrinkedData.push(chartDataArray[i]);
    }
  }
  chartDataArray = shrinkedData;
  myChart.setConfig(generateChartOptions(chartDataArray));
  myChart.setBackgroundColor('transparent');
  myChart.setWidth(width);
  myChart.setHeight(height);

  return myChart.getUrl();
};

function generateChartOptions(chartData) {
  const fullOptions = { ...chartOptions };
  fullOptions.data.labels = chartData.map((entry) => entry.x);
  fullOptions.data.datasets[0].data = chartData;
  return fullOptions;
}
