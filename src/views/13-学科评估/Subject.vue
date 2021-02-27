<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      originData: null,
      allData: null,
      startFlag: 0,
      addFlag: 1,
      titleFontSize: 0,
      timerId: null,
      subjectIndex: 0,
    };
  },
  computed: {
    endFlag() {
      return this.startFlag + this.addFlag;
    },
    showData() {
      return this.allData.slice(this.startFlag, this.endFlag)
    }
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
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: useData } = await this.$http.get(
        "13-第四轮学科评估/工学.json"
      );
      this.cleanData(useData);
    },
    cleanData(useData) {
      this.originData = useData;
      this.allData = useData.filter((item) => {
        return item.subjectIndex == this.subjectIndex;
      })[0]
      console.log(this.allData)
      this.info = this.allData.data.info;
      this.code = this.allData.data.code;
      this.name = this.allData.data.name;
      this.allData = this.allData.data.list;
      // console.log(this.allData)
      this.upData()
    },
    upData() {
      const upDataOption = {
        dataset: [
          {
            source: this.showData,
          },
        ],
        series: [
          {
            encode: {
              x: 4,
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
                text: this.name,
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
            barWidth: titleFontSize * scaleSize,
            itemStyle: {
              borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
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