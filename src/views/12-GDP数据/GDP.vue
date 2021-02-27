<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      chooseIndex: 1,
      startFlag: 0,
      addFlag: 1,
      titleFontSize: 0,
      timerId: null,
      originalData: null,
    };
  },
  computed: {
    endFlag() {
      return this.startFlag + this.addFlag;
    },
    showData() {
      return this.allData.slice(this.startFlag, this.endFlag);
    },
    allData() {
      return this.originalData.filter((item) => {
        return item[5] == this.chooseIndex;
      });
    },
    showPieData() {
      return this.allData.slice(0, this.endFlag);
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
      this.colorPalette = [
        "#2ec7c9",
        "#b6a2de",
        "#5ab1ef",
        "#ffb980",
        "#d87a80",
        "#8d98b3",
        "#e5cf0d",
        "#97b552",
        "#95706d",
        "#dc69aa",
        "#07a2a4",
        "#9a7fd1",
        "#588dd5",
        "#f5994e",
        "#c05050",
        "#59678c",
        "#c9ab00",
        "#7eb00a",
        "#6f5553",
        "#c14089",
      ];
      this.chartInstance = this.$echarts.init(this.$refs.chart, "macarons");
      const initOption = {
        backgroundColor: "rgba(225,108,150, 0.1)",
        grid: [
          {
            top: "10%",
            left: "15%",
            right: "30%",
          },
          {},
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: "value",
            // scale: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            label: {
              show: true,
            },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: "category",
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            // axisLabel: {
            //   formatter: (msg) => {
            //     if (msg < 1000) {
            //       return msg;
            //     } else {
            //       return `${msg / 1000}K`;
            //     }
            //   },
            // },
          },
        ],
        series: [
          {
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbol: "image://./static/img/human.png",
            symbolClip: true,
            symbolRepeat: true,
            label: {
              show: true,
              position: "top",
              color: "inherit",
              formatter: (item) => {
                let retStr = "";
                retStr = `GDP：${item.data[1]}亿`;
                return retStr;
              },
            },
          },
          {
            gridIndex: 1,
            type: "pie",
            roseType: "radius",
            center: ["75%", "70%"],
            radius: [60, 150],
            itemStyle: {
              borderRadius: 4,
              borderWidth: 4,
              borderColor: "#ffffff",
            },
            label: {
              show: true,
              position: "outside",
              formatter: (msg) => {
                let str = "";
                str = `${msg.data[0]}：${msg.data[6]}%`;
                return str;
              },
              color: "inherit",
            },
            // labelLine: {
            //   length: 30,
            //   smooth: true,
            // },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: useData } = await this.$http.get(
        "12-GDP数据/CleanCityGdp.json"
      );
      this.cleanData(useData);
    },
    cleanData(useData) {
      let cleanData = useData.reverse();
      this.originalData = cleanData;

      this.upData();
    },
    upData() {
      const upDataOption = {
        dataset: [
          {
            source: this.showData,
          },
          {
            source: this.showPieData,
          },
        ],
        series: [
          {
            type: "bar",
            datasetIndex: 0,
            itemStyle: {
              color: (item) => {
                let colorIndex = (item.data[8] - item.data[7]) % 20;
                return this.colorPalette[colorIndex];
              },
            },
            encode: {
              x: 1,
              y: 0,
            },
          },
          {
            datasetIndex: 1,
          },
        ],
        graphic: {
          elements: [
            {
              type: "text",
              left: "center",
              bottom: 30,
              style: {
                font: "bolder 40px monospace",
                fill: "rgba(100, 100, 100, 0.25)",
                text: `${this.showData.slice(-1)[0][0]} GDP: ${
                  this.showData.slice(-1)[0][1]
                }亿 增速：${this.showData.slice(-1)[0][2]}`,
              },
            },
            {
              type: "text",
              right: "center",
              top: 40,
              style: {
                font: "bolder 40px Jiangxi",
                fill: "rgba(150, 53, 126, 1)",
                text: `${this.showData.slice(-1)[0][4]}各县市GDP排行榜`,
                shadowBlur: 20,
                shadowOffsetY: 100,
                shadowColor: "#B03A5B",
              },
            },
          ],
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.addFlag < 15) {
          this.addFlag++;
        } else {
          if (this.endFlag >= this.allData.length) {
            this.chooseIndex++;
            this.startFlag = 0;
            this.addFlag = 1;
            // if (this.showData.length == 1) {
            //   this.chooseIndex++;
            // }
            // clearInterval(this.timerId);
          } else {
            // console.log("start", this.startFlag)
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
            barWidth: titleFontSize * scaleSize,
            itemStyle: {
              borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
            label: {
              fontSize: titleFontSize * scaleSize,
            },
          },
          {
            barWidth: titleFontSize * scaleSize,
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