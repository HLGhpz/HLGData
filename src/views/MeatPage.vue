<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      allData: null,
      chartInstance: null,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      
    }
  },
};
</script>

<style>
</style>