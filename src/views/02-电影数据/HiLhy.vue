<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startFlag: 0,
      addFlag: 1,
      titleFontSize: 0,
      timerId: null,
    };
  },
  computed: {
    endFlag() {
      return this.startFlag + this.addFlag;
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    // this.dataInterval();
    // window.addEventListener("resize", this.screenAdapter);
    // this.screenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart, "light");
      const initOption = {
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            axisLabel: {
              formatter: (msg) => {
                let retStr = "";
                retStr = this.$moment(msg).format("MM-DD");
                return retStr;
              },
            },
            axisLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
          },
        ],
        yAxis: [
          {
            type: "value",
            gridIndex: 0,
            axisLabel: {
              formatter: (msg) => {
                let retStr = "";
                retStr = `${msg / 10000}亿`;
                return retStr;
              },
            },
            minInterval: 30000,
          },
          {
            type: "category",
            gridIndex: 1,
          },
        ],
        grid: [
          {
            right: "40%",
            top: "10%",
          },
          {
            left: "70%",
            top: "10%",
          },
        ],
        // legend: [
        //   {},
        //   {
        //     data: ["票房", "d", "c"],
        //   },
        // ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: original } = await this.$http.get("02-电影数据/HiLhy.json");
      // this.allData = useData;
      this.cleanData(original);
    },
    cleanData(original) {
      let firstData = original.shift();
      original.map((item) => {
        item[4] = +item[4].replace("%", "");
        item[5] = +item[5].replace("%", "");
        if (item[1] == "LHY") {
          item[3] = -item[3];
          item[4] = -item[4];
          item[5] = -item[5];
        }
      });
      original.unshift(firstData);
      console.log(original);
      this.allData = original;
      this.upData();
    },
    upData() {
      const upDataOption = {
        dataset: [
          {
            source: this.allData,
          },
          {
            transform: {
              type: "filter",
              config: {
                and: [{ dimension: "Date", "=": "2/12" }],
              },
            },
          },
          {
            fromDatasetIndex: 1,
            transform: {
              type: "filter",
              config: {
                and: [{ dimension: "Movie", "=": "LHY" }],
              },
            },
          },
          {
            fromDatasetIndex: 1,
            transform: {
              type: "filter",
              config: {
                and: [{ dimension: "Movie", "=": "TRJ" }],
              },
            },
          },
        ],
        series: [
          {
            type: "line",
            datasetIndex: 2,
            encode: {
              x: 0,
              y: 2,
            },
            symbol: "rect",
            symbolSize: 10,
            lineStyle: {
              width: 5,
            },
            label: {
              show: true,
              formatter: (msg) => {
                let retStr = "";
                retStr = `${(msg.data[2] / 10000).toFixed(2)}`;
                return retStr;
              },
              color: "inherit",
            },
          },
          {
            type: "line",
            datasetIndex: 3,
            encode: {
              x: 0,
              y: 2,
            },
            symbol: "circle",
            symbolSize: 10,
            lineStyle: {
              width: 5,
            },
            label: {
              show: true,
              formatter: (msg) => {
                let retStr = "";
                retStr = `${(msg.data[2] / 10000).toFixed(2)}`;
                return retStr;
              },
              color: "inherit",
            },
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            stack: "Price",
            datasetIndex: 2,
            encode: {
              x: 3,
              y: 0,
            },
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            stack: "Ratio",
            datasetIndex: 2,
            encode: {
              x: 4,
              y: 0,
            },
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            stack: "Refund",
            datasetIndex: 2,
            encode: {
              x: 5,
              y: 0,
            },
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            stack: "Price",
            datasetIndex: 3,
            encode: {
              x: 3,
              y: 0,
            },
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            stack: "Ratio",
            datasetIndex: 3,
            encode: {
              x: 4,
              y: 0,
            },
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            stack: "Refund",
            datasetIndex: 3,
            encode: {
              x: 5,
              y: 0,
            },
          },
        ],
        graphic: {
          elements: [
            {
              type: "text",
              right: 160,
              bottom: 60,
              style: {
                font: "bolder 80px monospace",
                fill: "rgba(100, 100, 100, 0.25)",
                text: "hello world",
              },
            },
          ],
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.addFlag < 10) {
          this.addFlag++;
        } else {
          if (this.endFlag > this.allData.length) {
            clearInterval(this.timerId);
          } else {
            this.startFlag++;
          }
        }
        this.upData();
      }, 1000);
    },
    screenAdapter() {
      let titleFontSize = (this.$refs.chart.offsetHeight / 100) * 3.6;
      const scaleSize = 0.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        xAxis: {
          axisLabel: {
            fontSize: titleFontSize * scaleSize,
          },
        },
        yAxis: {
          axisLabel: {
            fontSize: titleFontSize * scaleSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
            label: {
              fontSize: titleFontSize * scaleSize,
            },
          },
          {
            // barWidth: titleFontSize,
            // itemStyle: {
            //   barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            // },
            label: {
              fontSize: titleFontSize * scaleSize,
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>


<style>
.main-container {
  height: 100%;
}
</style>