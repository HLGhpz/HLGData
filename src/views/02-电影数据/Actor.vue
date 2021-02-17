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
    };
  },
  computed: {
    endMovie() {
      return this.startMovie + this.addMovie;
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    // this.dataInterval();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart, "light");
      const initOption = {
        xAxis: {
          type: "value",
          scale: true,
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
          minInterval: 25,
          maxInterval: 50,
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: (arg) => {
                let targerColor;
                if (arg.data.gender == "男") {
                  targerColor = "#8EB1C7";
                } else if (arg.data.gender == "女") {
                  targerColor = '#EA9FA1'
                }
                return targerColor
              },
            },
            label: {
              show: true,
              color: 'inherit',
              formatter: (msg) => {
                // console.log("msg", msg);
                let retStr = "";
                retStr = `第${msg.data.index}名\t作品：${msg.data.number}部\n${msg.data.work}`;
                return retStr;
              },
              position: "right",
            },
          },
        ],
        grid: {
          top: "10%",
          left: "6%",
          right: "30%",
          bottom: "6%",
          containLabel: true,
        },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: actorData } = await this.$http.get(
        "02-电影数据/actor.json"
      );
      this.allData = actorData
        .sort((a, b) => {
          return b.Office - a.Office;
        })
        .slice(0, 100)
        .map((item, index) => {
          item.Index = index + 1;
          return item;
        })
        .reverse();

      console.log(this.allData);
      this.upData();
    },
    upData() {
      // let showArr = this.allData.slice(this.startMovie, this.endMovie);
      let showArr = this.allData.slice(0, 10);
      let nameArr = showArr.map((actor) => {
        return actor.Name;
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
          label: {},
          rich: {
            name: {},
          },
        },
        yAxis: {
          data: nameArr,
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      setInterval(() => {
        if (this.addMovie < 10) {
          this.addMovie++;
        } else {
          if (this.endMovie > this.allData.length) {
            this.startMovie = 0;
            this.addMovie = 1;
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
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: 66,
            },
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
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
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