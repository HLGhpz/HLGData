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
      let end = this.startFlag + this.addFlag;
      return end;
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
        backgroundColor: "rgba(227,176,180, 0.1)",
        grid: [
          {
            top: "10%",
            bottom: "50%",
          },
          {
            top: "60%",
          },
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: "category",
            scale: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            label: {
              show: true,
            },
          },
          {
            axisLabel: {
              // show: false
              margin: 20,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            gridIndex: 1,
            type: "category",
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: "value",
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: (msg) => {
                if (msg < 1000) {
                  return msg;
                } else {
                  return `${msg / 1000}K`;
                }
              },
            },
          },
          {
            gridIndex: 1,
            type: "value",
            axisLabel: {
              show: false,
              formatter: (msg) => {
                console.log(msg);
                if (msg < 1000) {
                  return msg;
                } else {
                  return `${msg / 1000}K`;
                }
              },
            },
          },
        ],
        series: [
          {
            type: "line",
            xAxisIndex: 0,
            yAxisIndex: 0,
            areaStyle: {
              color: "rgba(202, 85, 117, 0.2)",
            },
            smooth: true,
            markPoint: {
              data: [
                {
                  symbol: "image://./static/img/human.png",
                  symbolSize: 50,
                  name: "max",
                  type: "max",
                  symbolOffset: [0, "-50%"],
                  label: {
                    fontSize: 30,
                    position: "right",
                    color: "#AA1D2D",
                    formatter: (msg) => {
                      if (msg.value < 1000) {
                        return msg.value;
                      } else {
                        return `${(msg.value / 1000).toFixed(2)}K`;
                      }
                    },
                  },
                },
              ],
            },
          },
          {
            type: "pictorialBar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            symbol: "image://./static/img/human.png",
            symbolClip: true,
            symbolRepeat: true,
            markPoint: {
              data: [
                {
                  symbolSize: 80,
                  name: "max",
                  type: "max",
                  symbolOffset: [0, "-10%"],
                  label: {
                    fontSize: 20,
                    color: "#AA1D2D",
                  },
                },
              ],
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: useData } = await this.$http.get(
        "10-美国疫情/USADead.json"
      );
      this.cleanData(useData);
    },
    cleanData(useData) {
      let cleanData = useData;
      console.log(cleanData);
      this.allData = cleanData;
      this.upData();
    },
    upData() {
      const upDataOption = {
        dataset: [
          {
            source: this.allData.slice(1).slice(this.startFlag, this.endFlag),
          },
        ],
        series: [
          {
            // 累计死亡
            encode: {
              x: 1,
              y: 5,
            },
          },
          {
            // 每日新增死亡
            encode: {
              x: 1,
              y: 6,
            },
          },
        ],
        graphic: {
          elements: [
            {
              type: "text",
              left: "center",
              bottom: "middle",
              z: 100,
              // rotation: -45,
              style: {
                font: "bolder 40px monospace",
                fill: "rgba(100, 100, 100, 0.5)",
                text: `${
                  this.allData.slice(1).slice(this.endFlag - 1)[0][1]
                }\t新增死亡人数：${
                  this.allData.slice(1).slice(this.endFlag - 1)[0][6]
                }\t总死亡人数：${
                  this.allData.slice(1).slice(this.endFlag - 1)[0][5]
                }`,
              },
            },
          ],
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.addFlag < 30) {
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
        xAxis: [
          {},
          {
            gridIndex: 1,
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
        series: [
          {
            label: {
              fontSize: titleFontSize * scaleSize,
            },
          },
          {
            barWidth: titleFontSize,
            barCategoryGap: "30%",

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