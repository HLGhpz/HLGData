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
            formatter: (msg) => {
              let strRet = "";
              if (msg != 0) {
                strRet = msg / 10000;
              }
              return `${strRet}亿`;
            },
            showMinLabel: false,
          },
          minInterval: 100000,
          maxInterval: 500000,
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#FE8C80",
                },
                {
                  offset: 1,
                  color: "#BF3E62",
                },
              ]),
            },
            label: {
              show: true,
              formatter: (msg) => {
                // console.log(msg)
                let retStr = "";
                let time = this.$moment(msg.data.time).format("YYYY年MM月DD日");
                retStr = `第${msg.data.index}部\t\t票房 ${(
                  msg.data.value / 10000
                ).toFixed(2)} 亿\n时间：${time}`;
                return retStr;
              },
              position: "right",
            },
          },
        ],
        grid: {
          top: "10%",
          left: "3%",
          right: "20%",
          bottom: "3%",
          containLabel: true,
        },
        // title: {
        //   text: "81部超10亿票房电影",
        //   left: 20,
        //   top: 20,
        // },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: movieData } = await this.$http.get(
        "02-电影数据/movie.json"
      );
      this.allData = movieData;
      await this.allData.map((movie) => {
        movie.time = this.$moment(movie.time).format("YYYYMMDD");
        return movie;
      });
      await this.allData.sort((a, b) => {
        return a.time - b.time;
      });
      this.allData = await this.allData.filter((movie) => {
        return movie.office > 100000;
      });
      await this.allData.map((item, index) => {
        // console.log(item);
        item.index = index + 1;
        return item;
      });
      // console.log(this.allData);
      this.upData();
    },
    upData() {
      let showArr = this.allData.slice(this.startMovie, this.endMovie);
      let movieArr = showArr.map((movie) => {
        return movie.name;
      });
      let officeArr = showArr.map((movie) => {
        return {
          value: movie.office,
          time: movie.time,
          index: movie.index,
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
          data: movieArr,
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
      console.log(("width", this.$refs.chart.offsetHeight / 100) * 3.6);
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