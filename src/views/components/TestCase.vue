<template>
  <div>
    <!-- TESTCASE -->
    <q-table
      :columns="testcase.columns"
      :data="testcase.data"
      row-key="id"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :loading="loading"
      hide-header
      hide-bottom
      bordered
      style="height:inherit"
    >
      <template v-slot:top>
        <q-inner-loading
          :showing="loading"
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
        <span class="text-h6">Testcase</span>
        <q-space />

        <template>
          <div>
            <q-btn
              icon="add"
              color="primary"
              @click="showTestCaseTemplate"
              dense
            />
          </div>
        </template>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :class="testcaseRowClass(props.row)">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            @click="props.expand = !props.expand"
          >
            <span style="font-size: 14px">{{ col.value }}</span>
            <q-icon
              v-if="props.row.testcase_result == 'Pass'"
              name="check_circle"
              class="text-green"
              style="font-size: 2em; float: right;"
            />
            <q-icon
              v-if="props.row.testcase_result == 'Issues'"
              name="bug_report"
              class="text-red"
              style="font-size: 2em; float: right;"
            />
          </q-td>
          <q-td auto-width>
            <q-btn
              flat
              size="sm"
              :icon="props.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="props.expand = !props.expand"
            ></q-btn>
          </q-td>
        </q-tr>

        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div>
              <q-input
                filled
                :key="props.expand"
                v-model="props.row.testcase_description"
                label="Description"
                type="textarea"
                input-style="min-height: 50px"
                style="margin-bottom: 10px;font-size: 13px"
                dense
                autogrow
              />
            </div>

            <div>
              <q-input
                filled
                :key="props.expand"
                v-model="props.row.testcase_output"
                label="Output"
                type="textarea"
                autogrow
                input-style="min-height: 50px"
                style="margin-bottom: 10px;font-size: 13px"
                dense
              />
            </div>

            <div>
              <q-input
                filled
                :key="props.expand"
                v-model="props.row.testcase_vulns"
                label="Vulnerabilities"
                type="textarea"
                autogrow
                input-style="min-height: 50px"
                style="margin-bottom: 10px;font-size: 13px"
                dense
              />
            </div>

            <div class="q-gutter-md row">
              <q-select
                v-model="props.row.testcase_status"
                label="Status"
                :options="statusOptions"
                style="width: 200px"
                behavior="menu"
                outlined
                dense
              ></q-select>

              <q-select
                v-model="props.row.testcase_result"
                label="Result"
                :options="resultOptions"
                style="width: 200px"
                behavior="menu"
                outlined
                dense
              ></q-select>

              <q-btn color="teal" @click="updateTestCase(props.row)">
                Save
                <q-icon name="mdi-content-save-outline"></q-icon>
              </q-btn>

              <q-btn color="red" @click="deleteTestcase(props.row)">
                Delete
                <q-icon name="mdi-delete-forever-outline"></q-icon>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- END TESTCASE -->

    <!-- DIALOG TESTCASE SECTION -->

    <!-- CREATE NEW TESTCASE -->
    <q-dialog v-model="testcase.create_new_dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Create Testcase</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
            <q-input
              filled
              label="Name"
              autogrow
              dense
              v-model="new_testcase.testcase_name"
            ></q-input>
          </div>
          <div class="q-pa-md">
            <q-input
              filled
              v-model="new_testcase.testcase_description"
              label="Description"
              type="textarea"
              autogrow
              dense
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Create" v-close-popup @click="createTestcase" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- END CREATE NEW TESTCASE -->

    <!-- LIST TESTCASE TEMPLATE -->
    <q-dialog v-model="testcase.list_template_dialog">
      <q-card style="min-width: 950px; min-height: 600px">
        <template>
          <div class="q-pa-md">
            <q-table
              style="height: 600px"
              :columns="template_table.columns"
              :data="template_table.data"
              selection="multiple"
              :selected.sync="template_table.selection"
              @selection="onSelectTemplate"
              :filter="template_table.filter"
              row-key="id"
              :pagination.sync="pagination"
              wrap-cells
              hide-bottom
              flat
            >
              <template v-slot:top>
                <q-input
                  v-model="template_table.filter"
                  debounce="500"
                  filled
                  dense
                  placeholder="Search"
                  clearable
                  class="col-md-4"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>

                <q-space />

                <q-btn
                  color="primary"
                  label="New"
                  @click="
                    testcase.create_new_dialog = true;
                    testcase.list_template_dialog = false;
                  "
                ></q-btn>
              </template>
            </q-table>
          </div>
        </template>
      </q-card>
    </q-dialog>
    <!-- LIST TESTCASE TEMPLATE -->

    <!-- END DIALOG TESTCASE SECTION -->
  </div>
</template>

<script>
import tracking_service from "@/services/TrackingService.js";
import management_service from "@/services/ManagementService.js";
import Swal from "sweetalert2";
import utils from "@/utils.js";

export default {
  name: "TestCase",
  props: ["path_id", "round_id"],
  components: {},
  data() {
    return {
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
      pagination: {
        rowsPerPage: 0
      },
      statusOptions: ["Todo", "Doing", "Done"],
      resultOptions: ["Pass", "Issues", "NA"],
      loading: false
    };
  },
  created() {
    if (this.round_id && this.path_id) {
      this.getTestcases();
    }

    // Get all testcase template
    this.getTestCaseTemplate();
  },
  watch: {
    path_id(newVal) {
      if (newVal) {
        this.getTestcases();
      }
    }
  },
  methods: {
    getTestcases() {
      this.loading = true;
      this.testcase.data = [];
      tracking_service.GetTestCases(this.round_id, this.path_id).then(data => {
        if (data != null) {
          this.testcase.data = data;
          this.testcase.selected_testcases = data;
        }
        this.loading = false;
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

    showTestCaseTemplate() {
      this.testcase.list_template_dialog = true;
      var existed_template = this.testcase.data.map(i => i.template_id);

      this.template_table.data = this.template_table.fullData.filter(
        template => {
          return !existed_template.includes(template.id);
        }
      );
    },

    getTestCaseTemplate() {
      management_service.GetTestcaseTemplateList().then(data => {
        if (data != null) {
          this.template_table.fullData = data;
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
