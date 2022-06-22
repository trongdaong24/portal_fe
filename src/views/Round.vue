<template>
  <q-page class="ub-page" v-if="loaded">
    <div class="row items-right">
      <div class="col-1 q-ma-sm">
        <q-select
          label="Project Type"
          outlined
          v-model="filter"
          :options="project_type_options"
          dense
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6" style="padding: 5px">
        <q-card flat bordered class="my-card">
          <q-card-section class="text-center">
            <div class="text-subtitle2">Round Progress</div>
          </q-card-section>
          <q-card-section>
            <apexchart
              :options="chart.round_progress_chart.options"
              :series="roundProgressChartData"
              height="350px"
            ></apexchart>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6" style="padding: 5px">
        <q-card flat bordered class="my-card">
          <q-card-section class="text-center">
            <div class="text-subtitle2">Status</div>
          </q-card-section>
          <q-card-section>
            <apexchart
              :options="chart.status_chart.options"
              :series="roundStatusChartData"
              height="350px"
            ></apexchart>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row">
      <div class="col" style="padding: 5px">
        <q-table
          :columns="project_table.columns"
          row-key="id"
          :data="project_table.data"
          class="my-sticky-header-table"
          @row-click="handleClickEvent"
          :rows-per-page-options="[0]"
          :pagination.sync="project_table.pagination"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <router-link
                tag="a"
                :to="{ name: 'PathList', params: { round_id: props.row.id } }"
              >
                {{ props.row.display_name }}
              </router-link>
            </q-td>
          </template>
          <template v-slot:body-cell-member="props">
            <q-td :props="props">
              <q-select
                outlined
                multiple
                v-model="props.row.round_members"
                use-chips
                readonly
                dense
              ></q-select>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
//import RoundCard from "@/views/components/RoundCard.vue";
import tracking_service from "@/services/TrackingService.js";
import CONST from "@/data/CONST.js";

export default {
  name: "Round",
  components: {
    //    RoundCard
  },
  data() {
    return {
      loaded: false,
      filter: "ALL",
      project_type_options: ["ALL", "DELIVERY", "SSA", "MBSD"],
      chart: {
        status_chart: {
          series: [],

          options: {
            chart: {
              type: "bar",
              stacked: true,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
            },
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 10
              }
            },
            xaxis: {
              categories: CONST.ADMIN_PATH_STATUS_LIST
            },
            legend: {
              position: "right",
              offsetY: 40
            },
            fill: {
              opacity: 1
            }
          }
        },

        round_progress_chart: {
          series: [],
          options: {
            chart: {
              height: 350,
              type: "rangeBar"
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: "50%",
                rangeBarGroupRows: true
              }
            },
            fill: {
              type: "solid"
            },
            xaxis: {
              type: "datetime"
            },
            legend: {
              position: "right"
            },
            tooltip: {}
          }
        }
      },

      project_table: {
        data: [],
        data_all: [],
        columns: [
          {
            name: "no",
            align: "center",
            field: "no",
            style: "max-width:50px",
            label: "No"
          },
          {
            name: "name",
            field: "display_name",
            align: "left",
            style: "max-width:500px",
            label: "Project"
          },
          {
            name: "type",
            field: "project_type",
            align: "left",
            headerStyle: "max-width: 200px",
            label: "Project Type",
            sortable: true
          },
          {
            name: "start_date",
            field: "round_start_date",
            align: "left",
            style: "max-width:100px",
            label: "Start date",
            sortable: true
          },
          {
            name: "end_date",
            field: "round_end_date",
            align: "left",
            style: "max-width:100px",
            label: "Due date",
            sortable: true
          },
          {
            name: "total_request",
            field: row => row.project_status.path.total,
            align: "left",
            style: "max-width:50px",
            label: "Total Request",
            sortable: true
          },
          {
            name: "finish_request",
            field: row => row.project_status.path.finished,
            align: "left",
            style: "max-width:50px",
            label: "Finish Request",
            sortable: true
          },
          {
            name: "remain_request",
            field: row => row.project_status.path.remained,
            align: "left",
            style: "max-width:50px",
            label: "Remain Request",
            sortable: true
          },
          {
            name: "percent",
            field: row => row.project_status.path.percent,
            align: "left",
            style: "max-width:50px",
            label: "Percent",
            sortable: true
          },
          {
            name: "member",
            field: "round_members",
            align: "left",
            style: "max-width:300px",
            label: "Member"
          },
          {
            name: "reviewer",
            field: "reviewer",
            align: "left",
            style: "max-width:100px",
            label: "Reviewer",
            sortable: true
          }
        ],
        pagination: {
          rowsPerPage: 0
        }
      }
    };
  },
  mounted() {},

  created() {
    this.getRoundList();
  },

  watch: {
    filter(newVal) {
      if (newVal) {
        this.project_table.data = this.project_table.data_all.filter(e => {
          if (this.filter == "ALL") {
            return true;
          }

          return e.project_type == this.filter;
        });
      }
    }
  },

  computed: {
    roundProgressChartData: function() {
      var result = [];
      this.project_table.data.forEach(element => {
        var round_start_date = new Date(element.round_start_date);
        var round_end_date = new Date(element.round_end_date);

        result.push({
          name: element.round_title,
          data: [
            {
              x: element.round_title,
              y: [round_start_date.getTime(), round_end_date.getTime()]
            }
          ]
        });
      });

      return result;
    },

    roundStatusChartData: function() {
      var result = [];
      this.project_table.data.forEach(element => {
        result.push({
          name: element.round_title,
          data: element.project_status.path.detail
        });
      });
      return result;
    }
  },

  methods: {
    getRoundList() {
      tracking_service.GetRoundList().then(data => {
        if (data != null) {
          this.project_table.data = data;
          this.project_table.data_all = data;
          this.loaded = true;
        }

        this.addIndexTable(this.project_table.data);
      });
    },

    addIndexTable(data) {
      data.forEach((element, index) => {
        element.no = index + 1;

        var round_start_date = new Date(element.round_start_date);
        var round_end_date = new Date(element.round_end_date);

        this.chart.round_progress_chart.series.push({
          name: element.round_title,
          data: [
            {
              x: element.round_title,
              y: [round_start_date.getTime(), round_end_date.getTime()]
            }
          ]
        });
      });
    },

    handleClickEvent(evt, rowObj, index) {
      var round_start_date = new Date(rowObj.round_start_date);
      var round_end_date = new Date(rowObj.round_end_date);

      this.chart.round_progress_chart.series.push({
        name: rowObj.round_title,
        data: [
          {
            x: rowObj.round_title,
            y: [round_start_date.getTime(), round_end_date.getTime()]
          }
        ]
      });
    }
  }
};
</script>
