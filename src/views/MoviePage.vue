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
    };
  },
  mounted() {
    this.initChart()
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
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: movieData } = await this.$http.get(
        "02-电影数据/movie.json"
      );
      console.log('await1')
      this.allData = movieData;
      await this.allData.map((movie) => {
        movie.time = this.$moment(movie.time).format("YYYYMMDD");
        return movie;
      });
      await this.allData.sort((a, b) => {
        return b.time - a.time;
      });
      this.allData = await this.allData.filter((movie) => {
        return movie.office > 100000;
      });
      console.log(this.allData);
      this.upData()
    },
    upData() {
      const movieArr = this.allData.map((movie) => {
        return movie.name
      });
      const officeArr = this.allData.map((movie) => {
        return movie.office
      })
      console.log('movieArr', officeArr)
      const upDataOption = {
        xAxis: {
          data: officeArr
        },
        yAxis: {
          data: movieArr
        }
      }
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