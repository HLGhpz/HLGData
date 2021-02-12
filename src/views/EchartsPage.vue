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
      chartInstance: null
    };
  },
  mounted() {
    // this.initChart()
    // this.getData()
    this.testLoadsh()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart, "shine");
      const initOption = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      };
      this.chartInstance.setOption(initOption)
    },
    async getData(){
      const {data: ret} = await this.$http.get(
        "pub/名称代码对照.json"
      )
      const {data: eatData} = await this.$http.get(
        "01-食肉数据/食肉数据.json"
      )
      eatData.map((item) => {

        item[`${item.SUBJECT}Value`] = item.Value
        delete item.Value
        delete item.SUBJECT
        return item
        // console.log(item)
      })
      console.log(eatData)
      
    },
    testLoadsh() {
      let a = {
        x: 3,
        y: 4
      }
      let b = {
        y: 5,
        z: 4
      }
      _.assign(a,b)
      console.log(a)
    }
    
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