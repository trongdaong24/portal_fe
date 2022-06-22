<template>
  <q-page class="ub-page">
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-toolbar class="bg-grey-3 shadow-2 rounded-borders">
          <div class="q-gutter-sm q-pa-sm row">
            <q-input
              hint="Start Date"
              type="date"
              v-model="overall_chart.filter.start_date"
            />
            <q-space />
            <q-input
              hint="End Date"
              type="date"
              v-model="overall_chart.filter.end_date"
            />
            <q-space />
            <!-- <q-select
              hint="Type"
              :options="overall_chart.type_options"
              v-model="overall_chart.filter.type"
            />
            <q-space/> -->
            <q-btn
              color="primary"
              style="width: 80px; height: 40px; align-self: center;"
              @click="updateOverallChart"
              dense
              >Filter
            </q-btn>
          </div>
        </q-toolbar>
      </div>
    </div>
    <div class="q-pa-md">
      <div class="">
        <apexchart
          ref="overall_chart"
          :options="overallChartOptions"
          :series="overall_chart.series"
          height="320px"
        >
        </apexchart>
      </div>
    </div>
  </q-page>
</template>

<script>
import statistic_service from "@/services/StatisticService.js";
import moment from "moment";

export default {
  name: "Statistic",
  components: {},
  props: [""],
  data() {
    return {
      overall_chart: {
        options: {
          chart: {
            type: "line"
            // height: 350,
            // stacked: true
          },
          plotOptions: {
            // bar: {
            //   horizontal: true
            // },
            // line: {
            //   horizontal: true
            // }
          },
          stroke: {
            width: [0, 4]
            // colors: ["#fff"]
          },
          title: {
            text: "Overall"
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [1]
          },
          xaxis: {
            title: {
              text: "Pentester"
            },
            categories: []
            // labels: {
            //   formatter: function (val) {
            //     return val
            //   }
            // }
          },
          yaxis: [
            {
              title: {
                text: "Path"
              }
            },
            {
              opposite: true,
              title: {
                text: "Testcase"
              }
            }
          ],
          fill: {
            opacity: 1
          }
          // legend: {
          //   position: "top",
          //   horizontalAlign: "left",
          //   offsetX: 40
          // },
        },
        series: [],
        filter: {
          start_date: moment()
            .subtract(14, "days")
            .format("YYYY-MM-DD"),
          end_date: moment().format("YYYY-MM-DD"),
          type: "daily"
        },
        type_options: ["daily", "weekly", "monthly"],
        users: []
      }
    };
  },
  created() {
    this.updateOverallChart();
  },
  computed: {
    overallChartOptions: function() {
      var options = {
        chart: {
          type: "line"
          // height: 350,
          // stacked: true
        },
        plotOptions: {
          // bar: {
          //   horizontal: true
          // },
          // line: {
          //   horizontal: true
          // }
        },
        stroke: {
          width: [0, 4]
          // colors: ["#fff"]
        },
        title: {
          text: "Overall"
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        xaxis: {
          title: {
            text: undefined
          },
          categories: this.overall_chart.users
          // labels: {
          //   formatter: function (val) {
          //     return val
          //   }
          // }
        },
        yaxis: [
          {
            title: {
              text: "Path"
            }
          },
          {
            opposite: true,
            title: {
              text: "Testcase"
            }
          }
        ],
        fill: {
          opacity: 1
        }
        // legend: {
        //   position: "top",
        //   horizontalAlign: "left",
        //   offsetX: 40
        // },
      };

      return options;
    }
  },
  methods: {
    updateOverallChartData(data) {
      this.overall_chart.users = data.users;
      this.overall_chart.series = data.series;
    },

    updateOverallChart() {
      statistic_service
        .GetOverallPathData(this.overall_chart.filter)
        .then(data => {
          if (data != null) {
            this.updateOverallChartData(data);
          }
        });
    }
  }
};
</script>

<style></style>
