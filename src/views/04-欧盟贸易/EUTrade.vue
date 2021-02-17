<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startMovie: 0,
      addMovie: 1,
      titleFontSize: 0,
      timerId: null,
    };
  },
  computed: {
    endMovie() {
      return this.startMovie + this.addMovie;
    },
  },
  mounted() {
    // this.initChart();
    this.getData();
    // this.dataInterval();
    // window.addEventListener("resize", this.screenAdapter);
    // this.screenAdapter();
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
          axisLabel: {
            formatter: (msg) => {
              let strRet = "";
              if (msg != 0) {
                strRet = msg;
              }
              return `${strRet}亿`;
            },
            showMinLabel: false,
          },
          max: 200,
          // minInterval: 25,
          // maxInterval: 50,
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
              "path://M530.295692 549.739533v-55.816237h121.553426c10.275018 0 18.605753-8.329712 18.605754-18.605753 0-10.275018-8.329712-18.605753-18.605754-18.605754H543.246655l121.759111-102.329596c7.265474-7.265474 7.265474-19.045775 0-26.311249s-19.045775-7.265474-26.312272 0L512 434.548 385.306506 328.071967c-7.265474-7.265474-19.045775-7.265474-26.312272 0-7.265474 7.265474-7.265474 19.045775 0 26.311249l121.759111 102.329597H372.150882c-10.275018 0-18.605753 8.329712-18.605754 18.605753s8.329712 18.605753 18.605754 18.605753h120.934326v55.816237h-120.934326c-10.275018 0-18.605753 8.329712-18.605754 18.605753s8.329712 18.605753 18.605754 18.605754h120.934326v93.026719c0 10.276041 8.329712 18.605753 18.605754 18.605754s18.605753-8.329712 18.605753-18.605754v-93.026719H651.850142c10.275018 0 18.605753-8.329712 18.605753-18.605754 0-10.275018-8.329712-18.605753-18.605753-18.605753l-121.55445-0.001023z m428.231131 58.784847v199.76165c0 41.102117-33.379225 74.42199-74.605162 74.42199H140.078339c-41.203424 0-74.605162-33.423227-74.605162-74.42199V608.52438c56.047504 0 101.483322-43.841507 101.483322-97.922216s-45.435819-97.922217-101.483322-97.922217V212.918297c0-41.102117 33.379225-74.42199 74.605162-74.421989h743.843322c41.203424 0 74.605162 33.423227 74.605162 74.421989v199.76165c-56.047504 0-101.483322 43.841507-101.483322 97.922217s45.435819 97.922217 101.483322 97.922216z",
            itemStyle: {
              color: (arg) => {
                let targerColor;
                if (arg.data.gender == "男") {
                  targerColor = "#8EB1C7";
                } else if (arg.data.gender == "女") {
                  targerColor = "#EA9FA1";
                }
                return targerColor;
              },
            },
            label: {
              show: true,
              color: "inherit",
              formatter: (msg) => {
                // console.log("msg", msg);
                let retStr = "";
                retStr = `第${msg.data.index}名\t\t票房：${msg.data.value}亿\t\t作品：${msg.data.number}部\n${msg.data.work}`;
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
      const { data: tradeData } = await this.$http.get(
        "04-欧盟贸易/EUTrade.json"
      );
      this.allData = tradeData;
      // console.log(tradeData)
      // this.allData = tradeData
      //   .sort((a, b) => {
      //     return b.Office - a.Office;
      //   })
      //   .slice(0, 100)
      //   .map((item, index) => {
      //     item.Index = index + 1;
      //     return item;
      //   })
      //   .reverse();

      // console.log(this.allData);
      this.upData();
    },
    upData() {
      // let showArr = this.allData.slice(this.startMovie, this.endMovie);
      let showArr = this.allData;
      let timeArr = showArr.Date.map((item) => {
        item = this.$moment(item).format("YYYY-MM");
        return item;
      });
      let nameArr = showArr.Trade.map((item, index) => {
        return item.Name
      });
      let officeArr = showArr.map((actor) => {
        return {
          value: actor.Office,
          number: actor.Number,
          work: actor.MasterWork,
          index: actor.Index,
          gender: actor.Gender,
        };
      });
      const upDataOption = {
        series: {
          data: officeArr,
        },
        yAxis: {
          data: nameArr,
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.addMovie < 10) {
          this.addMovie++;
        } else {
          if (this.endMovie > this.allData.length) {
            clearInterval(this.timerId);
          } else {
            this.startMovie++;
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