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
        },
        grid: [
          {
            top: "10%",
            bottom: "10%",
            right: "30%",
            letf: "1%",
            containLabel: true,
          },
        ],
        series: [
          {
            type: "bar",
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
                    itemColor = "#333333";
                    break;
                  case "Lenovo":
                    itemColor = "#E2221A";
                    break;
                  case "HTC":
                    itemColor = "#95D60A";
                    break;
                  case "Asus":
                    itemColor = "#231815";
                    break;
                  case "Motorola":
                    itemColor = "#001428";
                    break;
                  default:
                    itemColor = "#F2F0FB";
                    break;
                }
                return itemColor;
              },
            },
            label: {
              show: true,
              formatter: (msg) => {
                return `${msg.data[1]} NO.${msg.data[6]}`;
              },
              position: "right",
              color: 'inherit'
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
        item[6] = index+1;
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
        graphic: {
          elements: [
            {
              // 将图片定位到最下方的中间：
              type: "image",
              right: 100, // 水平定位到中间
              bottom: 100, // 定位到距离下边界 10% 处
              style: {
                image: `./static/img/Phone/${
                  this.allData[this.endFund - 1][5]
                }.png`,
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