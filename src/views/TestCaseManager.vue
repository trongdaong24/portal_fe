<template>
  <q-page class="ub-page">
    <div class="row" style="margin-bottom: 5px">
      <div class="col-12 col-md-4">
        <q-table
          :columns="function_table.columns"
          :data="function_table.functions.data"
          row-key="id"
          hide-header
          hide-bottom
          :wrap-cells="true"
          style="height: 450px"
          virtual-scroll
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          flat
          bordered
          :filter="filter"
          :expanded="expanded"
        >
          <template v-slot:top>
            <div class="text-h6">Functions</div>
            <q-space />
            <q-input
              v-model="filter"
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
            <div class="cursor-pointer" style="width: 100px">
              <!-- <q-btn
                label="Insert"
                color="primary"
                style="margin-left: 5px"
              ></q-btn> -->
              <q-btn
                label="Insert"
                color="primary"
                @click="loadInsertFunction = true"
              />

              <q-dialog v-model="loadInsertFunction" persistent>
                <q-card style="min-width: 350px">
                  <q-card-section>
                    <div class="text-h6">Insert Function</div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input
                      filled
                      autogrow
                      v-model="insert_function.function_name"
                      label="Name"
                    />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input
                      filled
                      autogrow
                      v-model="insert_function.function_description"
                      label="Descriptions"
                    />
                  </q-card-section>
                  <q-card-actions align="right" class="text-primary">
                    <q-btn
                      outline
                      size="sm"
                      label="Cancel"
                      color="teal"
                      style="margin-right: 5px"
                      v-close-popup
                    />
                    <q-btn
                      outline
                      size="sm"
                      label="Insert"
                      color="teal"
                      style="margin-right: 5px"
                      @click="insertFunction"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>

              <!-- <q-popup-edit
                v-model="insert_function"
                class="bg-accent text-white"
                @save="insertFunction"
              >
                <div>
                  <form @submit="insertFunction">
                    <q-input
                      borderless
                      v-model="insert_function.function_name"
                      label="Name"
                    />
                    <q-input
                      borderless
                      v-model="insert_function.function_description"
                      label="Descriptions"
                    />
                    <q-btn
                      type="submit"
                      outline
                      style="color: goldenrod"
                      label="Insert"
                    />
                  </form>
                </div>    
              </q-popup-edit> -->
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
              v-bind:style="props.expand ? 'background-color:cornsilk' : ''"
            >
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                @click="toggleExpanded(props.row.id, props.row)"
                >{{ col.value }}</q-td
              >
              <q-td auto-width>
                <q-btn
                  flat
                  size="sm"
                  @click="toggleExpanded(props.row.id, props.row)"
                  :icon="props.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                ></q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%" class="q-pa-md">
                <div style="margin-bottom: 5px">
                  <q-input
                    filled
                    v-model="props.row.function_name"
                    label="Name"
                    dense
                  ></q-input>
                </div>

                <div style="margin-bottom: 5px">
                  <q-input
                    filled
                    v-model="props.row.function_condition"
                    label="Condition"
                    dense
                  ></q-input>
                </div>

                <div style="margin-bottom: 5px">
                  <q-input
                    filled
                    v-model="props.row.function_description"
                    label="Description"
                    dense
                    style="height: 50px"
                  ></q-input>
                </div>
                <div>
                  <q-btn
                    outline
                    size="sm"
                    label="Update"
                    color="teal"
                    style="margin-right: 5px"
                    @click="updateFunction(props.row)"
                  ></q-btn>
                  <q-btn
                    outline
                    size="sm"
                    label="Delete"
                    color="red"
                    @click="deleteComfirm(1, props.row)"
                  ></q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="col-12 col-md-8" style="padding-left: 5px">
        <q-card class="my-card" bordered flat>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="testcase" label="Testcase" />
            <q-tab name="standard" label="Standard" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="testcase">
              <div class="q-pa-md q-gutter-sm row">
                <q-input
                  v-model="filter_testcase"
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

                <q-btn
                  color="primary"
                  label="Insert"
                  @click="onRowClickTestcaseInsert"
                ></q-btn>
                <!-- <q-btn
                  color="secondary"
                  label="Import"
                  icon="mdi-cloud-upload-outline"
                  @click="pushFile()"
                ></q-btn> -->
                <q-btn
                  color="secondary"
                  label="Import"
                  icon="mdi-cloud-upload-outline"
                  style="float: right"
                  @click="uploadFileDialog = true"
                ></q-btn>
                <q-dialog v-model="uploadFileDialog">
                  <q-card style="width: 300px">
                    <q-card-section>
                      <div class="text-h6">Import Excel</div>
                      <q-separator />
                    </q-card-section>
                    <q-card-section>
                      <div>
                        <q-file
                          color="teal"
                          filled
                          v-model="file"
                          label="Upload your file"
                        >
                          <template v-slot:prepend>
                            <q-icon color="teal" name="cloud_upload"></q-icon>
                          </template>
                        </q-file>
                      </div>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn
                        flat
                        label="Push"
                        color="teal"
                        @click="pushFile()"
                      ></q-btn>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-btn
                  color="orange"
                  label="Export"
                  icon="mdi-cloud-download-outline"
                  @click.prevent="exportTestcase"
                ></q-btn>
              </div>

              <div>
                <template>
                  <div class="q-pa-md">
                    <q-table
                      :data="template_table.templates.data"
                      style="height: 305px"
                      :wrap-cells="true"
                      :columns="template_table.columns"
                      row-key="id"
                      :pagination.sync="pagination"
                      :rows-per-page-options="[0]"
                      :selected-rows-label="getSelectedString"
                      selection="multiple"
                      :selected.sync="selectedTestcase"
                      @row-click="onRowClickTestcase"
                      @selection="onRowSelectedTescase"
                      :filter="filter_testcase"
                      ref="tableTemplate"
                    >
                      <template v-slot:body-cell-template_description="props">
                        <q-td :props="props">
                          <pre style="font: inherit;">{{
                            props.row.template_description
                          }}</pre>
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </template>
              </div>
            </q-tab-panel>

            <q-tab-panel name="standard">
              <div class="q-pa-md q-gutter-sm row">
                <q-input
                  debounce="500"
                  filled
                  dense
                  placeholder="Search"
                  clearable
                  style="max-width: 300px"
                  v-model="standard_table.filter"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn
                  color="primary"
                  label="Insert"
                  @click="onClickStandardInsert"
                ></q-btn>
              </div>
              <div>
                <div></div>
                <q-table
                  :columns="standard_table.columns"
                  :data="standard_table.checklists.data"
                  style="max-height: 305px; table-layout: fixed"
                  :wrap-cells="true"
                  hide-bottom
                  :pagination.sync="standard_table.pagination"
                  :rows-per-page-options="[0]"
                  row-key="id"
                  flat
                  bordered
                  @row-click="onRowClickStandard"
                  :filter-method="filterNameChecklist"
                  :filter="standard_table.filter"
                  ref="tableStandard"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <div style="width: 100%">
      <q-splitter v-model="splitterModal" style="height: 350px">
        <template v-slot:before>
          <q-card class="my-card" bordered flat style="height: 100%">
            <q-card-section>
              <div class="text-h6 row">Detail</div>
              <div>
                <div style="text-align: right">
                  <template v-if="loadInsertTestcase == false">
                    <q-btn
                      outline
                      size="sm"
                      label="Update"
                      color="teal"
                      style="margin-right: 5px"
                      @click="updateTestcase"
                    ></q-btn>

                    <div style="float: right; margin-right: 5px">
                      <q-btn
                        outline
                        size="sm"
                        label="Standard"
                        color="teal"
                        style="margin-right: 5px"
                      ></q-btn>
                      <q-popup-edit class="bg-accent text-white">
                        <div style="width: 600px; max-height: 350px">
                          <q-input
                            debounce="500"
                            filled
                            dense
                            placeholder="Search"
                            clearable
                            style="max-width: 300px"
                            v-model="standard_table.filter"
                          >
                            <template v-slot:prepend>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                          <q-table
                            :columns="standard_table.columns"
                            :data="standard_table.checklists.data"
                            style="height: 305px"
                            :wrap-cells="true"
                            row-key="id"
                            :pagination.sync="pagination"
                            :rows-per-page-options="[0]"
                            selection="multiple"
                            :selected.sync="selectedStandard"
                            @row-click="onRowClickStandard"
                            @selection="onRowSelectedStandard"
                            :filter-method="filterNameChecklist"
                            :filter="standard_table.filter"
                          >
                          </q-table>
                        </div>
                      </q-popup-edit>
                    </div>
                    <q-btn
                      outline
                      size="sm"
                      label="Delete"
                      color="red"
                      style="margin-right: 5px"
                      @click="deleteComfirm(2)"
                    ></q-btn>
                  </template>
                  <template v-if="loadInsertTestcase == true">
                    <q-btn
                      outline
                      size="sm"
                      label="Insert"
                      color="teal"
                      style="margin-right: 5px"
                      @click="insertTestcase"
                    ></q-btn>
                  </template>
                </div>
              </div>
              <div class="q-pa-md">
                <q-input
                  ref="qInputTestcaseName"
                  filled
                  label="Name"
                  autogrow
                  style="margin-bottom: 5px"
                  v-model="testcase_selected.template_name"
                ></q-input>
                <q-input
                  filled
                  label="Description"
                  autogrow
                  :input-style="{ height: '61px' }"
                  style="margin-bottom: 5px"
                  v-model="testcase_selected.template_description"
                ></q-input>

                <q-input
                  filled
                  label="Expected Output"
                  autogrow
                  style="margin-bottom: 5px"
                  :input-style="{ height: '61px' }"
                  v-model="testcase_selected.template_expected_output"
                ></q-input>
              </div>
            </q-card-section>
          </q-card>
        </template>

        <template v-slot:after>
          <q-card class="my-card" bordered flat style="height: 100%">
            <q-card-section>
              <div class="text-h6">Standard</div>
              <div style="text-align: right">
                <template v-if="loadInsertChecklist == false">
                  <q-btn
                    outline
                    size="sm"
                    label="Update"
                    color="teal"
                    style="margin-right: 5px"
                    @click="updateChecklist"
                  ></q-btn>
                  <q-btn
                    outline
                    size="sm"
                    label="Delete"
                    color="red"
                    @click="deleteComfirm(3)"
                  ></q-btn>
                </template>
                <template v-if="loadInsertChecklist == true">
                  <q-btn
                    outline
                    size="sm"
                    label="Insert"
                    color="teal"
                    style="margin-right: 5px"
                    @click="insertChecklist"
                  ></q-btn>
                </template>
              </div>

              <div class="q-pa-md">
                <q-input
                  ref="qInputStandard"
                  filled
                  label="Standard"
                  v-model="checklist_islected.checklist_standard"
                  autogrow
                  style="margin-bottom: 5px"
                ></q-input>
                <q-input
                  filled
                  v-model="checklist_islected.checklist_id"
                  label="Checklist id"
                  autogrow
                  style="margin-bottom: 5px"
                ></q-input>

                <q-input
                  filled
                  label="Name"
                  v-model="checklist_islected.checklist_name"
                  autogrow
                  style="margin-bottom: 5px"
                ></q-input>

                <q-input
                  filled
                  v-model="checklist_islected.checklist_description"
                  label="Description"
                  autogrow
                  style="margin-bottom: 5px"
                ></q-input>
              </div>
            </q-card-section>
          </q-card>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { getHeader } from "@/services/config.js";
import { AUTH_REFRESH } from "../store/actions/auth";
import { QFile } from "quasar";
import Swal from "sweetalert2";
import management_service from "@/services/ManagementService.js";

const URL_TEMPLATE = "/api/management/template/";

export default {
  name: "TestCaseManager",
  components: {
    QFile
  },
  data() {
    return {
      selectedTestcase: [],
      selectedStandard: [],
      loadInsertFunction: false,

      checklistForTestcase: [],
      searchValueTestcase: "",
      searchValueStandard: "",
      uploadFileDialog: false,
      fileName: "",
      file: null,
      expanded: [],
      scrolled: false,
      loadChecklistInsert: true,
      loadInsertTestcase: true,
      loadInsertChecklist: true,
      loadingInstance: null,

      function_table: {
        columns: [
          {
            name: "name",
            field: row => row.function_name,
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "width:100px",
            label: "Name"
          }
        ],
        functions: {
          data: []
        },
        filter: ""
      },
      template_table: {
        columns: [
          {
            name: "template_name",
            field: row => row.template_name,
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "max-width:100px",
            label: "Name"
          },
          {
            name: "template_description",
            field: row => row.template_description,
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "max-width:100px",
            label: "Description"
          },
          {
            name: "template_expected_output",
            field: row => row.template_expected_output,
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "max-width:100px",
            label: "Expected ouput"
          }
        ],
        templates: {
          data: []
        },
        filter: ""
      },

      standard_table: {
        columns: [
          {
            name: "checklist_standard",
            field: "checklist_standard",
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "max-width:100px",
            label: "Standard"
          },
          {
            name: "checklist_name",
            field: "checklist_name",
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "max-width:100px",
            label: "Name"
          },
          {
            name: "checklist_id",
            field: "checklist_id",
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "max-width:100px",
            label: "Checklist id"
          },

          {
            name: "checklist_description",
            field: "checklist_description",
            align: "left",
            style: "max-width:100px;word-wrap:break-word;",
            headerStyle: "max-width:100px",
            label: "Description"
          }
        ],
        checklists: {
          data: []
        },
        filter: ""
      },

      pagination: {
        rowsPerPage: 0
      },
      filter: "",
      filter_testcase: "",
      filter_standard: "",
      insert_function: {
        function_name: "",
        function_color: "",
        function_description: "",
        function_testcases: []
      },
      testcase_selected: {
        index: -1,
        id: "",
        template_checklists: [],
        template_expected_output: "",
        template_description: "",
        template_name: ""
      },
      function_islected: {
        function_name: "",
        function_color: "",
        function_description: "",
        function_testcases: []
      },
      checklist_islected: {
        id: "",
        checklist_id: "",
        checklist_standard: "",
        checklist_description: ""
      },

      data_functions: [],
      data_testcase: [],
      data_checklists: [],
      tab: "testcase",

      virtualScrollOption: {
        enable: true
        // scrolling: this.scrolling,
      },

      splitterModal: 50,
      filter_value_column: ""
    };
  },
  created() {
    this.getTestCaseTemplate();
    this.getFunction();
    this.getChecklistStandard();
  },
  methods: {
    filterNameChecklist() {
      if (this.standard_table.filter.length > 0) {
        return this.standard_table.checklists.data.filter(row =>
          row.checklist_standard.includes(this.standard_table.filter)
        );
      }
      return this.standard_table.checklists.data;
    },

    getSelectedString(row, rows) {},
    deleteComfirm(tableDelete, row = null) {
      Swal.fire({
        title: "Are you sure delete?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      }).then(result => {
        if (result.value) {
          if (tableDelete === 1) {
            this.deleteFunction(row);
          } else if (tableDelete === 2) {
            this.deleteTestcase();
          } else if (tableDelete === 3) {
            this.deleteChecklist();
          }
        }
      });
    },
    alertError(message) {
      Swal.fire({
        title: "Error!",
        text: message,
        type: "error",
        confirmButtonText: "ok"
      });
    },
    showAlertSuccess(message) {
      Swal.fire({
        text: message,
        icon: "success",
        toast: true,
        position: "top-end",
        timerProgressBar: true,
        timer: 3000,
        showConfirmButton: false
      });
    },
    showAlertError(message) {
      Swal.fire({
        text: message,
        icon: "error",
        toast: true,
        position: "top-end",
        timerProgressBar: true,
        timer: 3000,
        showConfirmButton: false
      });
    },

    searchStandard() {
      let data = [];

      this.sourceDatachecklists.forEach(element => {
        if (
          element.name.includes(this.searchValueStandard) ||
          element.standard.includes(this.searchValueStandard) ||
          element.description.includes(this.searchValueStandard)
        ) {
          data.push(element);
        }
        this.data_checklists = data;
      });
    },
    onRowClickTestcase(evt, row, index) {
      this.selectedStandard = [];
      this.standard_table.checklists.data.forEach(element => {
        row.template_checklists.forEach(checklistElement => {
          if (element.id === checklistElement) {
            this.selectedStandard.push(element);
          }
        });
      });

      this.loadInsertTestcase = false;
      this.testcase_selected.id = row.id;
      this.testcase_selected.template_name = row.template_name;
      this.testcase_selected.template_description = row.template_description;
      this.testcase_selected.template_expected_output =
        row.template_expected_output;
      this.testcase_selected.template_checklists = row.template_checklists;
      this.sortChecklistStandardBySelected();
    },

    toggleExpanded(val, row) {
      this.selectedTestcase = [];
      this.template_table.templates.data.forEach(element => {
        row.function_testcases.forEach(elementFuntionTestcases => {
          if (element.id === elementFuntionTestcases) {
            this.selectedTestcase.push(element);
          }
        });
      });

      this.expanded = this.expanded[0] === val ? [] : [val];

      // this.checkboxOption.selectedRowKeys = [];
      // row.function_testcases.forEach((element) => {
      //   this.checkboxOption.selectedRowKeys.push(element);
      // });
      this.function_islected.id = row.id;
      this.function_islected.function_name = row.function_name;
      this.function_islected.function_description = row.function_description;
      this.function_islected.function_color = row.function_color;
      this.function_islected.function_testcases = row.function_testcases;

      if (this.expanded.length === 1) {
        this.sortTestcaseTemplateBySelected();
      } else {
        this.selectedTestcase = [];
      }
    },
    destroyed() {
      this.loadingInstance.destroy();
    },
    show() {
      this.loadingInstance.show();
    },
    close() {
      this.loadingInstance.close();
      this.scrolled = false;
    },
    sortChecklistStandardBySelected() {
      let data = this.standard_table.checklists.data;
      for (let i = data.length - 1; i >= 0; i--) {
        this.selectedStandard.forEach(element => {
          if (data[i] === element) {
            data.splice(i, 1);
          }
        });
      }
      this.selectedStandard.forEach(element => {
        if (!this.standard_table.checklists.data.includes(element)) {
          data.unshift(element);
        }
      });
    },
    sortTestcaseTemplateBySelected() {
      let data = this.template_table.templates.data;
      let dataToAdd = [];
      let indexRemove = [];

      for (let i = data.length - 1; i >= 0; i--) {
        this.selectedTestcase.forEach(element => {
          if (data[i] === element) {
            data.splice(i, 1);
          }
        });
      }

      this.selectedTestcase.forEach(element => {
        if (!this.template_table.templates.data.includes(element)) {
          data.unshift(element);
        }
      });
    },

    onRowClickTestcaseInsert: function(row) {
      // this.loadrequest = true;

      this.$refs.qInputTestcaseName.focus();
      this.loadInsertTestcase = true;
      this.testcase_selected.index = -1;
      this.testcase_selected.id = "";
      this.testcase_selected.template_name = "";
      this.testcase_selected.template_description = "";
      this.testcase_selected.template_expected_output = "";
      this.testcase_selected.template_checklists = "";
    },
    onClickStandardInsert: function(row) {
      // this.loadrequest = true;
      this.$refs.qInputStandard.focus();
      this.loadInsertChecklist = true;
      this.checklist_islected.checklist_name = "";
      this.checklist_islected.checklist_description = "";
      this.checklist_islected.checklist_id = "";
      this.checklist_islected.checklist_standard = "";
    },
    onRowClickStandard(evt, row, index) {
      this.loadInsertChecklist = false;
      this.checklist_islected.id = row.id;
      this.checklist_islected.checklist_name = row.checklist_name;
      this.checklist_islected.checklist_description = row.checklist_description;
      this.checklist_islected.checklist_id = row.checklist_id;
      this.checklist_islected.checklist_standard = row.checklist_standard;
    },
    onRowSelectedTescase(rows) {
      if (this.expanded.length === 1) {
        // this.expanded[0] is funtion id expanding
        if (rows.added === true) {
          this.editFunctionIdToTemplate(this.expanded[0], {
            id: rows.rows[0].id,
            is_add: 1
          });
        } else {
          this.editFunctionIdToTemplate(this.expanded[0], {
            id: rows.rows[0].id,
            is_add: 0
          });
        }
      }
    },
    onRowSelectedStandard(rows) {
      if (rows.added === true) {
        this.editChecklistAddTestcase(this.testcase_selected.id, {
          id: rows.rows[0].id,
          is_add: 1
        });
      } else {
        this.editChecklistAddTestcase(this.testcase_selected.id, {
          id: rows.rows[0].id,
          is_add: 0
        });
      }
    },

    editFunctionIdToTemplate(id, edit_input) {
      management_service
        .EditFunctionTestcasesOnFunction(id, edit_input)
        .then(res => {
          if (res.data.success !== undefined && res.data.success === false) {
            this.showAlertError(res.data.message);
          } else {
            this.function_table.functions.data.forEach(element => {
              if (element.id === id) {
                if (edit_input.is_add === 1) {
                  element.function_testcases.push(edit_input.id);
                } else if (edit_input.is_add === 0) {
                  for (let i = 0; i < element.function_testcases.length; i++) {
                    if (element.function_testcases[i] === edit_input.id) {
                      element.function_testcases.splice(i, 1);
                    }
                  }
                }
                this.sortTestcaseTemplateBySelected();
              }
            });
          }
        });
    },
    editChecklistAddTestcase(id, edit_input) {
      management_service
        .EditTemplateStandardOnTemplate(id, edit_input)
        .then(res => {
          if (res.data.success !== undefined && res.data.success === false) {
            this.showAlertError(res.data.message);
          } else {
            this.template_table.templates.data.forEach(element => {
              if (element.id === id) {
                if (edit_input.is_add === 1) {
                  element.template_checklists.push(edit_input.id);
                } else if (edit_input.is_add === 0) {
                  for (let i = 0; i < element.template_checklists.length; i++) {
                    if (element.template_checklists[i] === edit_input.id) {
                      element.template_checklists.splice(i, 1);
                    }
                  }
                }
                this.sortChecklistStandardBySelected();
              }
            });
          }
        });
    },
    exportTestcase() {
      management_service.ExportTestcase().then(response => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "TestcaseTemplate";
        link.click();
        URL.revokeObjectURL(link.href);
      });
    },
    pushFile() {
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("name", this.fileName);
      management_service.ImportFileTemplate(formData).then(res => {
        this.fileName = "";
        this.file = null;
        if (res.data.success !== undefined && res.data.success === false) {
          this.showAlertError(res.data.message);
        } else {
          this.getTestCaseTemplate();
          this.showAlertSuccess("Import File success");
        }
      });
    },
    insertFunction() {
      management_service.InsertFunction(this.insert_function).then(res => {
        if (res.data.success !== undefined && res.data.success === false) {
          this.showAlertError(res.data.message);
        } else {
          this.function_table.functions.data.unshift(res.data);
        }
      });
    },
    updateFunction(row) {
      management_service.UpdateFunction(row.id, row).then(res => {
        if (res.data.success !== undefined && res.data.success === false) {
          this.showAlertError(res.data.message);
        } else {
          this.function_table.functions.data.forEach(element => {
            if (element.id == res.data.id) {
              (element.function_name = res.data.function_name),
                (element.function_color = res.data.function_color);
              element.function_description = res.data.function_description;
              element.function_testcases = res.data.function_testcases;
            }
          });
        }
      });
    },
    deleteFunction(row) {
      management_service.DeleteFunction(row.id).then(res => {
        if (res.data.success !== undefined && res.data.success === false) {
          this.showAlertError(res.data.message);
        } else {
          for (let i = 0; i < this.function_table.functions.data.length; i++) {
            if (this.function_table.functions.data[i].id === row.id) {
              this.function_table.functions.data.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    insertChecklist() {
      var inputChecklist = this.checklist_islected;
      delete inputChecklist["id"];
      management_service.InsertChecklist(inputChecklist).then(res => {
        if (res.data.success !== undefined && res.data.success === false) {
          this.showAlertError(res.data.message);
        } else {
          this.standard_table.checklists.data.unshift(res.data);
          this.onClickStandardInsert();

          this.$refs.tableStandard.scrollTo(0);
        }
      });
    },
    deleteChecklist() {
      management_service
        .DeleteChecklist(this.checklist_islected.id)
        .then(res => {
          if (res.data.success !== undefined && res.data.success === false) {
            this.showAlertError(res.data.message);
          } else {
            for (
              let i = 0;
              i < this.standard_table.checklists.data.length;
              i++
            ) {
              if (
                this.standard_table.checklists.data[i].id ===
                this.checklist_islected.id
              ) {
                this.standard_table.checklists.data.splice(i, 1);
                break;
              }
            }
          }
        });
    },
    updateChecklist() {
      management_service
        .UpdateChecklist(this.checklist_islected.id, this.checklist_islected)
        .then(res => {
          if (res.data.success !== undefined && res.data.success === false) {
            this.showAlertError(res.data.message);
          } else {
            var count = 0;
            var breakMe = false;
            this.standard_table.checklists.data.forEach(element => {
              if (breakMe === false) {
                if (element.id == res.data.id) {
                  element.checklist_name = res.data.checklist_name;
                  element.checklist_description =
                    res.data.checklist_description;
                  element.checklist_id = res.data.checklist_id;
                  element.checklist_description =
                    res.data.checklist_description;
                  element.checklist_standard = res.data.checklist_standard;

                  this.$refs.tableStandard.scrollTo(count);
                }
                count = count + 1;
              }
            });
          }
        });
    },

    insertTestcase() {
      var tmp_insert = this.testcase_selected;
      delete tmp_insert["id"];
      management_service.InsertTestcase(tmp_insert).then(res => {
        if (res.data.success !== undefined && res.data.success === false) {
          this.showAlertError(res.data.message);
        } else {
          this.template_table.templates.data.unshift(res.data);

          this.$refs.tableTemplate.scrollTo(0);
        }
      });
    },

    deleteTestcase() {
      let testcase_template_tmp = this.testcase_selected;
      management_service.DeleteTestcase(testcase_template_tmp.id).then(res => {
        if (res.data.success !== undefined && res.data.success === false) {
          this.showAlertError(res.data.message);
        } else {
          var breakMe = false;
          for (let i = 0; i < this.template_table.templates.data.length; i++) {
            if (breakMe === false) {
              if (
                this.template_table.templates.data[i].id ===
                this.testcase_selected.id
              ) {
                this.template_table.templates.data.splice(i, 1);
              }
            }
          }
        }
      });
    },

    updateTestcase() {
      let testcase_template_tmp = this.testcase_selected;

      management_service
        .UpdateTestcase(testcase_template_tmp.id, testcase_template_tmp)
        .then(res => {
          if (res.data.success !== undefined && res.data.success === false) {
            this.showAlertError(res.data.message);
          } else {
            var count = 0;
            var breakMe = false;
            this.template_table.templates.data.forEach(element => {
              if (breakMe === false) {
                if (element.id == res.data.id) {
                  element.template_name = res.data.template_name;
                  element.template_description = res.data.template_description;
                  element.template_expected_output =
                    res.data.template_expected_output;
                  element.template_checklists = res.data.template_checklists;

                  this.$refs.tableTemplate.scrollTo(count);
                  breakMe = true;
                }
                count = count + 1;
              }
            });
          }
        });
    },
    getTestCaseTemplate() {
      management_service
        .GetTestcaseTemplateList()
        .then(data => {
          this.template_table.templates.data = data;
        })
        .catch(error => {
          console.log("There was an error: " + error);
          this.showAlertError(error);
        });
    },
    getFunction() {
      management_service
        .GetFunctionListManage()
        .then(data => {
          this.function_table.functions.data = data;
        })
        .catch(error => {
          console.log("There was an error: " + error);
          this.showAlertError(error);
        });
    },
    getChecklistStandard() {
      management_service
        .GetStadardList()
        .then(data => {
          this.standard_table.checklists.data = data;
        })
        .catch(error => {
          console.log("There was an error: " + error);
          this.showAlertError(error);
        });
    }
  }
};
</script>
