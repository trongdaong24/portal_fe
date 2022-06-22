<template>
  <div class="chart-wrapper">
    <apexchart :options="options" :series="series" height="250"> </apexchart>
  </div>
</template>

<script>
export default {
  name: "TChart",
  props: ["options", "series"]
};
</script>

<style>
div.chart-wrapper {
  align-items: center;
  justify-content: center;
}
</style>
