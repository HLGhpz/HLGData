<template>
  <div class="com-page">
    <div class="com-chart" ref="chart"></div>
    <div class="show-data">
      HELLO WORLD
    </div>
  </div>
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
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart, "shine");
      const initOption = {
        grid: [
          {
            left: "10%",
            right: "5%",
            height: "50%",
          },
          {
            left: "10%",
            right: "5%",
            top: "65%",
            height: "35%",
          },
        ],
        xAxis: [
          {
            type: "category",
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: (msg) => {
                let strRet = "";
                strRet = this.$moment(msg).format("YY-MM-DD");
                return strRet;
              },
              margin: 30,
            },

            // minInterval: 3600 * 24 * 1000 * 30,
            // maxInterval: 3600 * 24 * 1000 * 30,
          },
          {
            scale: true,
            type: "category",
            boundaryGap: false,
            gridIndex: 1,
            // axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            // minInterval: 3600 * 24 * 1000 * 30,
            // maxInterval: 3600 * 24 * 1000 * 30,
          },
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true,
            },
            axisLabel: {
              formatter: (msg) => {
                let strRet = "";
                strRet = `${msg}$`;
                return strRet;
              },
              margin: 30,
            },
          },
          {
            scale: true,
            gridIndex: 1,
            inverse: true,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          },
        ],
        series: [
          {
            type: "k",
            name: "日k",
            itemStyle: {
              color: "#FD1050",
              color0: "#0CF49B",
              borderColor: "#FD1050",
              borderColor0: "#0CF49B",
            },
          },
          {
            naem: "Volumn",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
        },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: BTCData } = await this.$http.get("03-比特币/BTC02_16.json");
      this.allData = BTCData.reverse();
      this.allData.map((item) => {
        // console.log(item.Date)
        item.Date = this.$moment(item.Date).format("YYYYMMDD");
        return item;
      });
      this.upData();
    },
    upData() {
      let showData = this.allData.slice(2000, 2100);
      let timeArr = showData.map((item) => {
        return item.Date;
      });
      let volumeArr = showData.map((item) => {
        if (typeof item.Volume == "string") {
          item.Volume = parseInt(item.Volume.replace("K", ""));
        }
        return item.Volume;
      });
      console.log(volumeArr);
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
        xAxis: [
          {
            data: timeArr,
          },
          {
            data: timeArr,
          },
        ],
        series: [
          {
            data: dataArr,
          },
          {
            data: volumeArr,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    calculateMA(dayCount, data) {
      let result = [];
      for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += data[i - j][1];
        }
        result.push(sum / dayCount).toFixed(2);
      }
      return result;
    },
    screenAdapter() {
      let titleFontSize = (this.$refs.chart.offsetHeight / 100) * 3.6;
      const scaleSize = 0.6;
      const adapterOption = {
        // title: {
        //   textStyle: {
        //     fontSize: titleFontSize,
        //   },
        // },
        // tooltip: {
        //   axisPointer: {
        //     lineStyle: {
        //       width: 66,
        //     },
        //   },
        // },
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
            label: {
              fontSize: titleFontSize * scaleSize,
              color: "#B03A5B",
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
 .show-data {

	width: 240px;
	height: 193px;
	position: fixed;/*这里一定要设置*/
  z-index: 9990;

 }
</style>