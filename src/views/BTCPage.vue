<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      allData: null,
    };
  },
  mounted() {
    this.initChart();
    this.getData();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart, "shine");
      const initOption = {
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#8392A5",
            },
          },
        },
        yAxis: {
          // type: "value",
          scale: true,
          axisLine: {
            lineStyle: {
              color: "#8392A5",
            },
          },
          splitLine: {
            show: true,
          },
        },
        grid: {
          bottom: 80,
        },
        dataZoom: [
          {
            textStyle: {
              color: "#8392A5",
            },
            handleIcon:
              "path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            dataBackground: {
              areaStyle: {
                color: "#8392A5",
              },
              lineStyle: {
                opacity: 0.8,
                color: "#8392A5",
              },
            },
            brushSelect: true,
          },
        ],
        series: [
          {
            type: "candlestick",
            name: "日k",
            itemStyle: {
              color: "#FD1050",
              color0: "#0CF49B",
              borderColor: "#FD1050",
              borderColor0: "#0CF49B",
            },
            markPoint: {
              data: [
                {
                  name: "highest value",
                  type: "max",
                  // valueDim: "highest",
                },
                {
                  name: "lowest value",
                  type: "min",
                  // valueDim: "lowest",
                },
                {
                  name: "average value",
                  type: "average",
                  // valueDim: "averageValue",
                },
              ],
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: BTCData } = await this.$http.get("03-比特币/BTC02_14.json");
      this.allData = BTCData.reverse();
      this.allData.map((item) => {
        // console.log(item.Date)
        item.Date = this.$moment(item.Date).format("YYYYMMDD");
        return item;
      });
      this.upData();
    },
    upData() {
      let showData = this.allData;
      let timeArr = showData.map((item) => {
        return item.Date;
      });
      // let dataArr = showData.map(
      //   (item)=> {
      //     return [item.Open, item.Close, item.Low, item.High]
      //   }
      // )

      let dataArr = showData.map((item) => {
        if (typeof item.Open == "string") {
          item.Open = parseInt(item.Open.replace(",", ""));
        }
        if (typeof item.Close == "string") {
          item.Close = parseInt(item.Close.replace(",", ""));
        }
        if (typeof item.Low == "string") {
          item.Low = parseInt(item.Low.replace(",", ""));
        }
        if (typeof item.High == "string") {
          item.High = parseInt(item.High.replace(",", ""));
        }
        return [item.Open, item.Close, item.Low, item.High];
      });
      let dataOption = {
        xAxis: {
          data: timeArr,
        },
        series: [
          {
            data: dataArr,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
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