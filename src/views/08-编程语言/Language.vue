<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startFund: 0,
      addFund: 1,
      titleFontSize: 0,
      timerId: null,
    };
  },
  computed: {
    endFund() {
      return this.startFund + this.addFund;
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
        xAxis: {
          type: "value",
          // axisLabel: {
          //   formatter: (msg) => {
          //     return `${msg}亿美元`;
          //   },
          // },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "category",
          axisLine: {
            onZero: false,
            show: false,
          },
          labelLine: {
            show: false,
          },
          // axisLabel: {
          //   formatter: (msg) => {
          //     return `${msg}`;
          //   },
          // },
        },
        grid: [
          {
            top: "10%",
            bottom: "10%",
            right: "50%",
            containLabel: true,
          },
        ],
        series: [
          {
            type: "pictorialBar",
            label: {
              show: true,
              formatter: (msg) => {
                return `NO.${msg.data[0]}`;
              },
              position: "right",
            },
            symbol: "image://./static/img/computer.png",
            symbolRepeat: true,
            symbolClip: true,
          },
          {
            type: "pie",
            roseType: "radius",
            center: ["75%", "35%"],
            radius: ["5%", "40%"],
            label: {
              formatter: (msg) => {
                let retstr = `${msg.data[2]} ${msg.data[3]}%`;
                return retstr;
              },
              color: "inherit",
            },
            // minShowLabelAngle: 20,
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: codeData } = await this.$http.get(
        "08-编程语言/language.json"
      );
      let otherState = [0, null, "Other", 0, null];
      this.allData = codeData;

      // this.allData.map((item, index) => {
      //   otherState[3] += item[3];
      // });
      // otherState[3] = +(100 - otherState[3]).toFixed(2);
      // this.allData.push(otherState)
      this.allData.sort((a, b) => {
        return b[0] - a[0];
      });
      console.log(this.allData);

      this.upData();
    },
    upData() {
      const upDataOption = {
        dataset: [
          {
            source: this.allData.slice(this.startFund, this.endFund),
          },
          {
            source: this.allData.slice(0, this.endFund),
          },
        ],
        series: [
          {
            datasetIndex: 0,
            encode: {
              x: 3,
              y: 2,
            },
          },
          {
            datasetIndex: 1,
            encode: {
              itemName: 2,
              value: 3,
            },
            // minShowLabelAngle: 20,
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
                text: `NO.${this.allData[this.endFund - 1][0]} ${this.allData[this.endFund - 1][2]}`,
              },
            },
          ],
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.addFund < 10) {
          this.addFund++;
        } else {
          if (this.endFund > this.allData.length) {
            clearInterval(this.timerId);
          } else {
            this.startFund++;
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