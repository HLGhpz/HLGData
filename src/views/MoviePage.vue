<template>
  <el-container class="main-container">
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <div class="com-chart" ref="chart"></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startMovie: 0,
      endMovie: 10,
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
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
          },
        ],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
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
        console.log(item);
        item.index = index + 1;
        return item;
      });
      console.log(this.allData);
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
      let timeArr = showArr.map((movie) => {
        return movie.time;
      });
      console.log("movieArr", timeArr);
      const upDataOption = {
        series: {
          data: officeArr,
          label: {
            show: true,
            formatter: (msg) => {
              // console.log(msg)
              let retStr = "";
              let time = this.$moment(msg.data.time).format("YYYY年MM月DD日");
              retStr = `第${msg.data.index}部  时间：${time}`;
              return retStr;
            },
          },
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