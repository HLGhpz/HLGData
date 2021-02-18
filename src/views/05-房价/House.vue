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
    this.dataInterval();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart, "light");
      const initOption = {
        grid: {
          left: "10%",
          right: "30%",
          top: "10%",
        },
        xAxis: {
          type: "value",
          // axisLabel: {
          //   formatter: (msg) => {
          //     let strRet = "";
          //     if (msg != 0) {
          //       strRet = msg;
          //     }
          //     return `${strRet}亿`;
          //   },
          //   showMinLabel: false,
          // },
          max: 10,
        },
        yAxis: {
          type: "category",
          axisTick: { show: false },
          axisLine: { show: false },
          splitArea: true,
          color: "#fff",
          fontWeight: "bold",
        },
        series: [
          {
            type: "pictorialBar",
            symbolRepeat: "true",
            symbolClip: true,
            symbolOffset: ["50%", 0],
            // symbolPosition: 'center',
            symbol:
              "path://M511.574284 31.759831c-265.174892 0-480.091782 214.973175-480.091782 480.088712 0 265.11042 214.91689 480.088712 480.091782 480.088712 265.050042 0 480.089735-214.978292 480.089735-480.088712C991.662996 246.733006 776.624327 31.759831 511.574284 31.759831zM634.972511 697.756381c-25.254362 18.62916-55.759559 32.693131-92.016014 35.56876l0 59.20315-63.39072 0 0-60.140543c-38.752418-4.561095-66.634756-16.063608-90.137134-34.942466-31.133538-24.815342-40.636415-51.322291-46.758126-84.579291l95.39104-23.316127c0 31.320812 32.378961 67.198625 80.642443 67.198625 28.75219 0 63.134881-14.064995 62.758286-51.510588-0.249699-30.626977-32.630707-52.567714-67.635598-60.446527-36.258501-8.127488-109.521529-33.067679-129.773731-55.322587-20.381144-22.126988-26.007551-53.573673-26.007551-90.14225 0-31.442591 14.00564-63.198329 36.755852-82.393404 22.128011-18.687491 48.008667-30.691448 84.764518-35.190118l0-50.508724 63.39072 0 0 50.321449c34.754169 3.750597 63.385603 14.691288 85.390812 33.442227 27.377824 23.506471 41.254522 53.635074 41.254522 71.763813l-95.268237 22.378733c0-23.501354-35.255613-52.510406-59.259435-52.510406-31.130468 0-55.760583 8.754804-55.760583 47.694496 0 28.008211 21.256113 37.134493 58.139884 48.94913 62.010214 19.753827 109.017015 45.443115 130.644606 67.637644 21.504788 22.318355 32.257182 50.386944 32.257182 84.325499C680.355248 647.18728 664.72452 675.506591 634.972511 697.756381z",
            itemStyle: {
              color: "#ffeb3b",
            },
            label: {
              show: true,
              // color: "inherit",
              formatter: (msg) => {
                let retStr = "";
                retStr = `第${msg.data.index}名\t\t房价：${msg.data.value}`;
                return retStr;
              },
              position: "right",
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: houseData } = await this.$http.get("05-房价/house.json");
      this.allData = houseData
        .sort((a, b) => {
          return b.Value - a.Value;
        })
        .map((item, index) => {
          item.Index = index + 1;
          item.Value = item.Value.toFixed(2);
          return item;
        })
        .slice(0, 100)
        .reverse();

      console.log(this.allData);
      this.upData();
    },
    upData() {
      let showArr = this.allData.slice(this.startHouse, this.endHouse);
      // let showArr = this.allData.slice(0, 10);
      let houseArr = showArr.map((house) => {
        return house.Name;
      });
      let valueArr = showArr.map((house) => {
        return {
          value: house.Value,
          index: house.Index,
        };
      });
      const upDataOption = {
        series: {
          data: valueArr,
        },
        yAxis: {
          data: houseArr,
        },
      };
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