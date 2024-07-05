export default class Constants {
  static TOKEN_NAME = `x-auth`;
  static PRIMARY = "#6F42C1";
  static INFO = "#0288D1";
  static CHART_HEIGHT = 300;
  static LINE_CHART_OPTIONS = {
    borderColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(0, 0, 0)",
    fill: true,
    smooth: true,
    responsive: true,
    maintainAspectRatio: false,
    pointBackgroundColor: "#fff",
    radius: 3,
    scales: {
      y: {
        min: 0,
      },
      x: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      filler: {
        propagate: true,
      },
    },
  };
  static BAR_CHART_OPTIONS = {
    borderColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(0, 0, 0)",
    responsive: true,
    maintainAspectRatio: false,
    borderRadius: 0,
    barThicknesss: 10,
    maxBarThickness: 10,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  static PIE_CHART_OPTIONS = {
    //https://www.chartjs.org/docs/latest/charts/doughnut.html
    circumference: 360,
    animation: { animateScale: true, animateRotate: false },
    spacing: 3,
    borderRadius: 0,
    borderWidth: 0,
    offset: 0,
    rotation: 0,
    weight: 0,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
      colors: {
        enabled: true,
      },
    },
  };
  static PIE_CHART_COLORS = [
    "#1DDFA3",
    "#23ABD8",
    "#4C6EDB",
    "#52F667",
    "#6E40AA",
    "#AFF05B",
    "#BF3CAF",
    "#E2B72F",
    "#FE4B83",
    "#FF7847",
  ];
}
