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
          max: 1000000000,
          axisLabel: {
            formatter: (msg) => {
              return `${msg / 100000000}亿美元`;
            },
          },
          minInterval: 300000000,
          maxInterval: 400000000,
        },
        yAxis: {
          type: "category",
          axisLine: {
            onZero: false,
            show: false,
          },
          axisLabel: {
            formatter: (msg) => {
              return `${msg}`;
            },
          },
        },
        grid: [
          {
            top: "10%",
            bottom: "10%",
            containLabel: true,
          },
        ],
        series: [
          {
            type: "bar",
            label: {
              show: true,
              formatter: (msg) => {
                let retstr = "";
                if (msg.data[5] != null) {
                  retstr = `${(msg.data[2] / 100000000).toFixed(2)}亿美元 NO.${
                    msg.data[5]
                  }`;
                } else {
                  retstr = `${(msg.data[2] / 100000000).toFixed(2)}亿美元`;
                }
                return retstr;
              },
              rich: {
                a: {
                  color: "red",
                },
                b: {
                  color: "blur",
                },
              },
              position: "right",
            },
          },
          {
            type: "pie",
            roseType: "radius",
            center: ["75%", "35%"],
            radius: ["5%", "40%"],
            label: {
              formatter: (msg) => {
                let retstr = `${msg.data[0]} ${msg.data[1]}%`;
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
      const { data: fundData } = await this.$http.get(
        "07-联合国会费/fund.json"
      );
      let otherState = ["Other", 0, 0];
      this.allData = fundData
        .filter((item) => {
          return typeof item[1] != "string" && item[1] != 100;
        })
        .sort((a, b) => {
          return b[1] - a[1];
        })
        .slice(0, 50);

      this.allData.map((item, index) => {
        item[5] = index + 1;
        item[1] = +item[1].toFixed(3);
        otherState[1] += item[1];
        otherState[2] += item[2];
      });
      otherState[1] = +(100 - otherState[1]).toFixed(3);
      otherState[2] = +(3176058600 - otherState[2]);
      this.allData.push(otherState);
      this.allData.sort((a, b) => {
        return a[1] - b[1];
      });
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
              x: 2,
              y: 0,
            },
          },
          {
            datasetIndex: 1,
            encode: {
              itemName: 0,
              value: 1,
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
                text: this.allData[this.endFund - 1][0],
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