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
          //     // console.log(msg);
          //     return `${msg / 100000000}亿美元`;
          //   },
          // },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          min: 90,
        },
        yAxis: {
          type: "category",
          axisLine: {
            onZero: false,
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
            containLabel: true,
          },
        ],
        series: [
          {
            type: "bar",
            // symbol:'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
            // symbolRepeat: true,
            // symbolClip: true,
            label: {
              show: true,
              position: "right",
            },
            itemStyle: {
              color: (item) => {
                console.log(item);
                let itemColor = null;
                switch (item.data[5]) {
                  case "Apple":
                    itemColor = "#888888";
                    break;
                  case "Huawei":
                    itemColor = "#AA1D2D";
                    break;
                  case "Vivo":
                    itemColor = "#405EFF";
                    break;
                  case "Oppo":
                    itemColor = "#0F6836";
                    break;
                  case "Xiaomi":
                    itemColor = "#FF6700";
                    break;
                  case "Honor":
                    itemColor = "#000000";
                    break;
                  case "LG":
                    itemColor = "#CF3059";
                    break;
                  case "Samsung":
                    itemColor = "#018AFF";
                    break;
                  case "OnePlus":
                    itemColor = "#F4000E";
                    break;
                  case "Google":
                    itemColor = "#FBBC05";
                    break;
                  case "Sony":
                    itemColor = "#444444";
                    break;
                  default:
                    itemColor = "#F2F0FB";
                    break;
                }
                return itemColor;
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: phoneData } = await this.$http.get(
        "09-智能设备/dxophone.json"
      );
      phoneData.map((item, index) => {
        item[6] = index;
      });
      this.allData = phoneData.reverse();
      this.upData();
    },
    upData() {
      const upDataOption = {
        dataset: [
          {
            source: this.allData.slice(this.startFund, this.endFund),
          },
        ],
        series: [
          {
            encode: {
              x: 1,
              y: 0,
            },
          },
        ],
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