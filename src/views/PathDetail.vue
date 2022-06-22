<template>
  <q-page class="ub-page">
    <!-- PATH NAME -->
    <div class="q-ma-sm row text-h6">
      <q-btn icon="arrow_back" @click="back" dense flat />
      {{ path_detail.name ? path_detail.name : "" }}
      <q-space />
      <q-select
        label="Status"
        style="width: 200px"
        outlined
        :class="pathStatusRowClass(path_detail)"
        :options="path_status_list"
        :value="path_detail.status"
        :disable="
          permission === 'pentester' && path_detail.status == 'Reviewed'
        "
        @input="updatePathField(path_detail, 'status', ...arguments)"
        dense
      />
    </div>

    <!-- END PATH NAME -->

    <!-- MAIN CONTENT -->
    <div>
      <q-splitter style="height: 87vh" v-model="splitterHorizon" horizontal>
        <template v-slot:before>
          <q-splitter v-model="splitterTop">
            <!-- ES REQUEST TABLE -->
            <template v-slot:before>
              <!-- TABLE -->
              <q-table
                :columns="request_table.columns"
                :data="request_table.data"
                row-key="id"
                :wrap-cells="true"
                @row-click="requestTableClickEvent"
                @row-contextmenu="requestTableRightClickEvent"
                :pagination.sync="pagination"
                :rows-per-page-options="[0]"
                :loading="request_table.loading"
                hide-bottom
                bordered
                class="my-sticky-header-table"
              >
                <!-- Table Body -->
                <template v-slot:body-cell-url="props">
                  <q-td :props="props">
                    <p
                      style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom:0px;"
                    >
                      {{ props.row.request.url }}
                    </p>
                  </q-td>
                </template>
                <!-- End Table Body -->
              </q-table>
              <!-- END TABLE -->

              <!-- CONTEXT MENU -->
              <q-menu
                v-if="request_table.selected_request != null"
                touch-position
                context-menu
              >
                <q-list dense style="min-width:200px">
                  <!-- Path Detail -->
                  <q-item clickable v-close-popup>
                    <q-item-section @click="setMainPathRequest">
                      Set as main request
                    </q-item-section>
                  </q-item>

                  <!-- End Path Detail -->
                </q-list>
              </q-menu>
              <!-- END CONTEXT MENU -->
            </template>
            <!-- END ES REQUEST TABLE -->

            <!-- TESTCASE -->
            <template v-slot:after>
              <TestCase
                style="height:inherit"
                :round_id="round_id"
                :path_id="path_id"
              ></TestCase>
            </template>
            <!-- END TESTCASE -->
          </q-splitter>
        </template>

        <template v-slot:after>
          <!-- REQUEST INFO COMPONENT -->
          <div>
            <RequestLog :request="request_table.selected_request"></RequestLog>
          </div>
          <!-- END REQUEST INFO COMPONENT -->
        </template>
      </q-splitter>
    </div>
    <!-- END MAIN CONTENT -->
  </q-page>
</template>

<script>
import RequestLog from "@/views/components/RequestLog.vue";
import TestCase from "@/views/components/TestCase.vue";

import tracking_service from "@/services/TrackingService.js";
import management_service from "@/services/ManagementService.js";

import Swal from "sweetalert2";
import store from "@/store/store";
import utils from "@/utils.js";
import CONST from "@/data/CONST.js";

export default {
  name: "TrackingDetail",
  props: ["path"],
  components: {
    RequestLog,
    TestCase
  },
  data() {
    return {
      // GENERAL info
      round_id: "",
      path_id: "",
      path_detail: {},
      path_status_list: [],
      splitterHorizon: 50,
      splitterTop: 45,

      // REQUEST TABLE properties
      request_table: {
        columns: [
          {
            name: "method",
            field: row => row.request.method,
            align: "left",
            style: "max-width:100px;",
            label: "Method",
            sortable: true
          },
          {
            name: "url",
            field: row => row.request.url,
            align: "left",
            style: "max-width:300px;",
            label: "URL",
            sortable: true
          },
          {
            name: "length",
            field: row => row.response.length,
            align: "center",
            style: "max-width:100px;",
            label: "Length",
            sortable: true
          },
          {
            name: "status_code",
            field: row => row.response.status,
            align: "center",
            style: "max-width:100px;",
            label: "Code",
            sortable: true
          },
          {
            name: "user",
            field: row => row.user,
            align: "center",
            style: "max-width: 150px;",
            label: "User",
            sortable: true
          },
          {
            name: "tool",
            field: row => row.entry.tool,
            align: "center",
            style: "max-width: 150px;",
            label: "Tool",
            sortable: true
          },
          {
            name: "time",
            field: row => row.time,
            align: "center",
            style: "max-width: 150px;",
            label: "Time",
            sortable: true
          }
        ],
        data: [],
        selected_row: null,
        selected_request: null,
        filter: "",
        loading: false
      },

      // LIST TEMPLATE TABLE properties
      template_table: {
        columns: [
          {
            name: "name",
            field: row => row.template_name,
            align: "left",
            label: "Name"
          }
        ],
        fullData: [],
        data: [],
        selection: [],
        filter: ""
      },

      testcase: {
        columns: [
          {
            name: "testcase_name",
            align: "left",
            field: "testcase_name",
            sortable: true
          }
        ],
        data: [],
        selected_testcases: [],
        list_template_dialog: false,
        create_new_dialog: false
      },

      new_testcase: {
        testcase_name: "",
        testcase_description: ""
      },

      pagination: {
        rowsPerPage: 0
      },

      // statusOptions: ["Todo", "Doing", "Done", "Recheck", "Reviewed"],
      statusOptions: ["Todo", "Doing", "Done"],
      resultOptions: ["Pass", "Issues", "NA"],

      loading: false
    };
  },

  created() {
    this.round_id = String(this.$route.params.round_id);
    this.path_id = String(this.$route.params.path_id);

    this.permission = store.getters.permission;

    if (this.permission == "pentester") {
      this.path_status_list = CONST.PENTESTER_PATH_STATUS_LIST;
    } else {
      this.path_status_list = CONST.ADMIN_PATH_STATUS_LIST;
    }

    // Get path detail from path list page or call API if open new tab
    if (this.path) {
      this.path_detail = this.path;
    } else {
      this.getPathDetail();
    }

    // Get ES Requests of this path
    this.getESRequests();

    // Get testcases of this path
    // this.getTestcases();

    // // Get all testcase template
    // this.getTestCaseTemplate();
  },

  watch: {
    "testcase.data": function(newVal) {
      var existed_template = newVal.map(i => i.template_id);

      this.template_table.data = this.template_table.fullData.filter(
        template => {
          return !existed_template.includes(template.id);
        }
      );
    }
  },

  methods: {
    back() {
      this.$router.push({
        name: "PathList",
        params: {
          round_id: this.round_id,
          table_scroll: this.path_id
        }
      });
    },

    getPathDetail() {
      return tracking_service
        .GetPathDetail(this.round_id, this.path_id)
        .then(result => {
          if (result) {
            this.path_detail = result;
            return true;
          }
          return false;
        });
    },

    // Call API update field(s) of single path
    updatePathField(path, field, value) {
      var path = path;
      console.log("Updating field " + field + " of path " + path.id);

      // if (this.edit_name) {
      //   this.edit_name = false;
      // }

      return tracking_service
        .UpdatePath(this.round_id, path.id, field, value)
        .then(updated_path => {
          if (updated_path !== null) {
            this.path_detail = updated_path;
            return true;
          }

          return false;
        });
    },

    pathStatusRowClass(path) {
      if (path.status == "NotFound") {
        return "bg-amber-2";
      }

      if (path.status == "NotTarget") {
        return "bg-grey-5";
      }

      if (path.status == "Doing") {
        return "bg-green-1";
      }

      if (path.status == "Done") {
        return "bg-green-3";
      }

      if (path.status == "Pending") {
        return "bg-orange-3";
      }

      if (path.status == "Recheck") {
        return "bg-orange-5";
      }

      if (path.status == "Reviewed") {
        return "bg-blue-5";
      }

      return "";
    },

    getESRequests() {
      tracking_service.GetESRequests(this.round_id, this.path_id).then(data => {
        if (data != null) {
          this.request_table.data = data;
        }
      });
    },

    requestTableClickEvent(evt, rowObj, index) {
      this.request_table.selected_request = rowObj;
      this.request_table.selected_row = evt.target.parentElement;
    },

    requestTableRightClickEvent(evt, rowObj, index) {
      console.log(rowObj);
      this.request_table.selected_request = rowObj;
      this.request_table.selected_row = evt.target.parentElement;
    },

    setMainPathRequest() {
      tracking_service
        .SetMainRequest(
          this.round_id,
          this.path_id,
          this.request_table.selected_request.id
        )
        .then(result => {
          console.log(result);
        });
    },

    getTestcases() {
      tracking_service.GetTestCases(this.round_id, this.path_id).then(data => {
        if (data != null) {
          this.testcase.data = data;
          this.testcase.selected_testcases = data;
        }
      });
    },

    createTestcase() {
      return tracking_service
        .CreateTestcase(this.round_id, this.path_id, this.new_testcase)
        .then(result => {
          if (result != null) {
            this.testcase.data.push(result);
          }
        });
    },

    updateTestCase(testcase) {
      return tracking_service
        .UpdateTestcase(this.round_id, this.path_id, testcase)
        .then(result => {
          console.log(result);
        });
    },

    deleteTestcase(testcase) {
      Swal.fire({
        title: "Are you sure delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(result => {
        if (result.isConfirmed) {
          tracking_service
            .DeleteTestcase(this.round_id, this.path_id, testcase.id)
            .then(result => {
              if (result != null) {
                utils.removeItemFromArray(this.testcase.data, testcase);
              }
            });
        }
      });
    },

    testcaseRowClass(testcase) {
      if (testcase.testcase_status == "Doing") {
        return "bg-green-1";
      }

      if (testcase.testcase_status == "Done") {
        return "bg-green-3";
      }

      if (testcase.testcase_status == "Recheck") {
        return "bg-orange-5";
      }

      if (testcase.testcase_status == "Reviewed") {
        return "bg-blue-2";
      }

      return "";
    },

    getTestCaseTemplate() {
      management_service.GetTestcaseTemplateList().then(data => {
        if (data != null) {
          var existed_template = this.testcase.data.map(i => i.template_id);

          this.template_table.fullData = data;
          this.template_table.data = data.filter(template => {
            return !existed_template.includes(template.id);
          });
        }
      });
    },

    onSelectTemplate({ rows, added, evt }) {
      if (
        added &&
        rows.length == 1 // Not support choose all template (Not any path need all template)
      ) {
        var template = rows[0];
        var new_testcase = {
          template_id: template.id // Only need to supply template id when create testcase based on template
        };

        tracking_service
          .CreateTestcase(this.round_id, this.path_id, new_testcase)
          .then(result => {
            if (result != null) {
              this.testcase.data.push(result);
            }
          });
      }
    }
  }
};
</script>
