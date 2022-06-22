import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import setupInterceptors from "./services/setupInterceptors";
import VueMeta from "vue-meta";

//import "vue-easytable/libs/theme-default/index.css";
//import VueEasytable from "vue-easytable";

import VueApexCharts from "vue-apexcharts";

import {
  DashBlocks,
  DbDashboard,
  DbHorizon,
  DbSunburst,
  DbSankey,
  DbRidgeline,
  DbChartjsBar,
  DbChartjsHorizontalBar,
  DbChartjsDoughnut,
  DbChartjsLine,
  DbChartjsPie,
  DbChartjsPolarArea,
  DbChartjsRadar,
  DbChartjsBubble,
  DbChartjsScatter,
  DbNumber,
  DbEasyPie,
  DbTrendLine,
  DbTrendBar,
  DbSparkline,
  DbDygraphsBar,
  DbDygraphsLine,
  DbDygraphsSparkLine,
  DbDygraphsDateTimeHistogram,
} from "dashblocks";
//import ElementUI from "element-ui";
//import "element-ui/lib/theme-chalk/index.css";

//Vue.use(ElementUI);
Vue.use(DashBlocks, {
  components: {
    DbDashboard,
    DbHorizon,
    DbSunburst,
    DbSankey,
    DbRidgeline,
    DbChartjsBar,
    DbChartjsHorizontalBar,
    DbChartjsDoughnut,
    DbChartjsLine,
    DbChartjsPie,
    DbChartjsPolarArea,
    DbChartjsRadar,
    DbChartjsBubble,
    DbChartjsScatter,
    DbNumber,
    DbEasyPie,
    DbTrendLine,
    DbTrendBar,
    DbSparkline,
    DbDygraphsBar,
    DbDygraphsLine,
    DbDygraphsSparkLine,
    DbDygraphsDateTimeHistogram,
  },
  //components: dashblocksComponents
});
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
//Vue.use(VueEasytable);
// Sample: to import all
/*
import { DashBlocks } from 'dashblocks';
import * as dashblocksComponents from 'dashblocks';
Vue.use(DashBlocks, {
  components: dashblocksComponents
});
*/

// Dashblocks CSS
//import "dashblocks/dist/dashblocks.css";

import "./quasar";

import hljs from "highlight.js";

Vue.directive("highlightjs", {
  deep: true,
  bind: function (el, binding) {
    // on first bind, highlight all targets
    let targets = el.querySelectorAll("code");
    targets.forEach((target) => {
      // if a value is directly assigned to the directive, use this
      // instead of the element content.
      if (binding.value) {
        target.innerHTML = binding.value;
      }
      hljs.highlightBlock(target);
    });
  },
  componentUpdated: function (el, binding) {
    // after an update, re-fill the content and then highlight
    let targets = el.querySelectorAll("code");
    targets.forEach((target) => {
      if (binding.value) {
        target.innerHTML = binding.value;
        hljs.highlightBlock(target);
      }
    });
  },
});

//Vue.config.productionTip = false;

Vue.use(VueMeta);
setupInterceptors(router, store);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
