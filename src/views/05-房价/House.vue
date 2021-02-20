<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: [],
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
        legend: {
          top: "bottom",
        },
        grid: {
          top: "10%",
          bottom: "10%",
        },
        series: [
          {
            type: "pie",
            roseType: "radius",
            center: ["50%", "50%"],
            radius: [100, 400],
            itemStyle: {
              borderRadius: 12,
              borderWidth: 4,
              borderColor: "#ffffff",
            },
            label: {
              show: true,
              position: "outside",
              formatter: (msg) => {
                let str = "";
                str = `No.${msg.data.index}\t${msg.data.name}\n房价:${msg.data.value}万/㎡`;
                return str;
              },
              color: "inherit",
            },
            labelLine: {
              length: 30,
              smooth: true,
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data: houseData } = await this.$http.get("05-房价/house.json");
      let cityArr = [];
      let house = [];
      houseData.map((item, index) => {
        if (cityArr.includes(item.Name) == false) {
          cityArr.push(item.Name);
          this.allData.push(item);
        }
      });
      this.allData = this.allData
        .sort((a, b) => {
          return b.Value - a.Value;
        })
        .map((item, index) => {
          item.Index = index + 1;
          item.Value = item.Value.toFixed(2);
          return item;
        })
        .slice(0, 77)
        .reverse();
      console.log(this.allData);

      this.upData();
    },
    upData() {
      let showArr = this.allData.slice(this.startHouse, this.endHouse);
      let valueArr = showArr.map((house) => {
        return {
          value: house.Value,
          name: house.Name,
          index: house.Index,
        };
      });
      const upDataOption = {
        series: {
          data: valueArr,
        },
      };
      this.chartInstance.setOption(upDataOption);
    },
    dataInterval() {
      this.timerId = setInterval(() => {
        if (this.addHouse < 12) {
          this.addHouse++;
        } else {
          if (this.endHouse > this.allData.length) {
            clearInterval(this.timerId);
          } else {
            this.startHouse++;
          }
        }
        // this.addHouse ++;
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
        series: [
          {
            barWidth: titleFontSize,
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