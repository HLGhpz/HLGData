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
        calendar: [
          {
            left: "center",
            top: "middle",
            cellSize: [70, 70],
            yearLabel: { show: false },
            orient: "vertical",
            dayLabel: {
              firstDay: 1,
              nameMap: "cn",
            },
            monthLabel: {
              show: false,
            },
            range: "2020-06",
          },
        ],
        series: [
          {
            type: "scatter",
            coordinateSystem: "calendar",
            symbolSize: 1,
            label: {
              show: true,
              formatter: function (params) {
                var d = echarts.number.parseDate(params.value[0]);
                return "y";
              },
              color: "#a00",
            },
            data: 's',
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
            source: this.allData,
          },
        ],
        // series: [],
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