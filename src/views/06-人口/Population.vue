<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startHouse: 0,
      addHouse: 1,
      titleFontSize: 0,
      timerId: null,
    };
  },
  computed: {
    endHouse() {
      return this.startHouse + this.addHouse;
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
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'bar'
        }]
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: populationData } = await this.$http.get(
        "06-人口/population-csv.json"
      );
      this.allData = populationData;
      // console.log(this.allData)
      this.upData()
    },
    upData() {
      const upDataOption = {
        dataset: {
          source: this.allData
        }
      }
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.addHouse < 10) {
          this.addHouse++;
        } else {
          if (this.endHouse > this.allData.length) {
            clearInterval(this.timerId);
          } else {
            this.startHouse++;
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
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

/* .el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
} */

.main-container {
  height: 100%;
}
</style>