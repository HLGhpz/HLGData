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
      gadFlag: 11,
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
    this.dataInterval();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
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
            axisLabel: {
              show: false,
            },
          },
          {
            type: "category",
            gridIndex: 1,
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
            gridIndex: 2,
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
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
            type: "value",
            gridIndex: 1,
            axisLabel: {
              formatter: (msg) => {
                let retStr = "";
                retStr = `${msg / 10000}亿`;
                return retStr;
              },
            },
            // minInterval: 30000,
          },
          {
            type: "category",
            gridIndex: 2,
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        grid: [
          {
            right: "40%",
            top: "10%",
            bottom: "55%",
          },
          {
            right: "40%",
            top: "55%",
          },
          {
            left: "70%",
            top: "40%",
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
      this.cleanData(original);
    },
    cleanData(original) {
      let firstData = original.shift();
      original.map((item, index) => {
        item[4] = +item[4].replace("%", "");
        item[5] = +item[5].replace("%", "");
        if (item[1] == "LHY") {
          item[3] = -item[3];
          item[4] = -item[4];
          item[5] = -item[5];
          if (index == 0) {
            item[6] = item[2];
          } else {
            item[6] = original[index - 1][6] + item[2];
          }
        } else if (item[1] == "TRJ") {
          if (index == this.gadFlag) {
            item[6] = item[2];
          } else {
            item[6] = original[index - 1][6] + item[2];
          }
        }
      });
      firstData.push("AllOffice");
      original.unshift(firstData);
      console.log(original);
      this.allData = original;
      this.startFlag = "2021/02/12";
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
                and: [
                  { dimension: "Movie", "=": "LHY" },
                  { dimension: "Date", "<=": this.startFlag, parser: "time" },
                ],
              },
            },
          },
          {
            transform: {
              type: "filter",
              config: {
                and: [
                  { dimension: "Movie", "=": "TRJ" },
                  { dimension: "Date", "<=": this.startFlag, parser: "time" },
                ],
              },
            },
          },
          {
            transform: {
              type: "filter",
              config: {
                and: [
                  { dimension: "Movie", "=": "LHY" },
                  { dimension: "Date", "=": this.startFlag, parser: "time" },
                ],
              },
            },
          },
          {
            transform: {
              type: "filter",
              config: {
                and: [
                  { dimension: "Movie", "=": "TRJ" },
                  { dimension: "Date", "=": this.startFlag, parser: "time" },
                ],
              },
            },
          },
        ],
        series: [
          {
            name: "L_LHY",
            type: "line",
            datasetIndex: 1,
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
              fontSize: 20,
              formatter: (msg) => {
                let retStr = "";
                retStr = `${(msg.data[2] / 10000).toFixed(2)}`;
                return retStr;
              },
              color: "inherit",
              position: "top",
            },
            color: "#EE3F4D",
          },
          {
            naem: "L_TRJ",
            type: "line",
            datasetIndex: 2,
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
              fontSize: 20,
              formatter: (msg) => {
                let retStr = "";
                retStr = `${(msg.data[2] / 10000).toFixed(2)}`;
                return retStr;
              },
              color: "inherit",
              position: "bottom",
            },
            color: "#1DB791",
          },
          {
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            datasetIndex: 1,
            encode: {
              x: 0,
              y: 6,
            },
            symbol: "rect",
            symbolSize: 10,
            lineStyle: {
              width: 5,
            },
            label: {
              show: true,
              fontSize: 20,
              formatter: (msg) => {
                let retStr = "";
                retStr = `${(msg.data[6] / 10000).toFixed(2)}`;
                return retStr;
              },
              color: "inherit",
              position: "bottom",
            },
            color: "#EE3F4D",
          },
          {
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            datasetIndex: 2,
            encode: {
              x: 0,
              y: 6,
            },
            symbol: "circle",
            symbolSize: 10,
            lineStyle: {
              width: 5,
            },
            label: {
              show: true,
              fontSize: 20,
              formatter: (msg) => {
                let retStr = "";
                retStr = `${(msg.data[6] / 10000).toFixed(2)}`;
                return retStr;
              },
              color: "inherit",
            },
            color: "#1DB791",
          },
          {
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            stack: "Price",
            datasetIndex: 3,
            encode: {
              x: 3,
              y: 0,
            },
            barWidth: 50,
            barGap: "150%",
            itemStyle: {
              borderRadius: [25, 0, 0, 25],
              color: "#EE3F4D",
            },
            label: {
              show: true,
              fontSize: 20,
              position: "left",
              formatter: (msg) => {
                let strRet = "";
                strRet = `${-msg.data[3]}¥`;
                return strRet;
              },
            },
          },
          {
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            stack: "Ratio",
            datasetIndex: 3,
            encode: {
              x: 4,
              y: 0,
            },
            barWidth: 50,
            itemStyle: {
              borderRadius: [25, 0, 0, 25],
              color: "#EE3F4D",
            },
            label: {
              show: true,
              fontSize: 20,
              position: "left",
              formatter: (msg) => {
                let strRet = "";
                strRet = `${-msg.data[4]}%`;
                return strRet;
              },
            },
          },
          {
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            stack: "Refund",
            datasetIndex: 3,
            encode: {
              x: 5,
              y: 0,
            },
            barWidth: 50,
            itemStyle: {
              borderRadius: [25, 0, 0, 25],
              color: "#EE3F4D",
            },
            label: {
              show: true,
              fontSize: 20,
              position: "left",
              formatter: (msg) => {
                let strRet = "";
                strRet = `${-msg.data[5]}%`;
                return strRet;
              },
            },
          },
          {
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            stack: "Price",
            datasetIndex: 4,
            encode: {
              x: 3,
              y: 0,
            },
            itemStyle: {
              borderRadius: [0, 25, 25, 0],
              color: "#1ba784",
            },
            label: {
              show: true,
              fontSize: 20,
              position: "right",
              formatter: (msg) => {
                let strRet = "";
                strRet = `${msg.data[3]}¥`;
                return strRet;
              },
            },
          },
          {
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            stack: "Ratio",
            datasetIndex: 4,
            encode: {
              x: 4,
              y: 0,
            },
            itemStyle: {
              borderRadius: [0, 25, 25, 0],
              color: "#1ba784",
            },
            label: {
              show: true,
              fontSize: 20,
              position: "right",
              formatter: (msg) => {
                let strRet = "";
                strRet = `${msg.data[4]}%`;
                return strRet;
              },
            },
          },
          {
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            stack: "Refund",
            datasetIndex: 4,
            encode: {
              x: 5,
              y: 0,
            },
            itemStyle: {
              borderRadius: [0, 25, 25, 0],
              color: "#1ba784",
            },
            label: {
              show: true,
              fontSize: 20,
              position: "right",
              formatter: (msg) => {
                let strRet = "";
                strRet = `${msg.data[5]}%`;
                return strRet;
              },
            },
          },
        ],
        graphic: {
          elements: [
            {
              type: "text",
              right: 270,
              bottom: 60,
              style: {
                font: "bolder 80px monospace",
                fill: "rgba(100, 100, 100, 0.55)",
                text: this.$moment(this.startFlag).format("MM-DD"),
              },
            },
          ],
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.$moment(this.startFlag) < this.$moment("2021/02/22")) {
          this.startFlag = this.$moment(this.startFlag)
            .add(1, "days")
            .format("YYYY/MM/DD");
        }
        this.upData();
      }, 2000);
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
        xAxis: [
          {
            axisLabel: {
              fontSize: titleFontSize * scaleSize,
            },
          },
          {
            axisLabel: {
              fontSize: titleFontSize * scaleSize,
            },
          },
        ],
        yAxis: [
          {
            axisLabel: {
              fontSize: titleFontSize * scaleSize,
            },
          },
          {
            axisLabel: {
              fontSize: titleFontSize * scaleSize,
            },
          },
        ],
        // series: [
        //   {
        //     label: {
        //       fontSize: titleFontSize * scaleSize,
        //     },
        //   }
        // ],
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