<template>
  <q-page class="ub-page">
    <!-- HDEADER COMPONENT -->
    <div class="items-center" style="margin-bottom: 10px">
      <div class="col-md-12">
        <span class="text-h6" v-if="round.data">{{
          round.data.display_name
        }}</span>
      </div>
    </div>
    <!-- END HDEADER COMPONENT -->

    <div>
      <q-splitter style="height: 90vh" v-model="splitterHorizon" horizontal>
        <!-- PATH LIST COMPONENT -->
        <template v-slot:before>
          <!-- PATH TABLE -->
          <div style="height: 100%">
            <q-table
              :columns="table.columns"
              :data="table.data"
              :filter="table.filter"
              :filter-method="filterMethod"
              selection="multiple"
              :selected.sync="path.selected_paths"
              @selection="onRowSelection"
              row-key="id"
              class="my-sticky-header-table"
              :wrap-cells="true"
              :pagination.sync="table.pagination"
              :rows-per-page-options="[0]"
              @row-contextmenu="handleRightClickEvent"
              @row-click="handleClickEvent"
              no-data-label="No path available."
              no-results-label="No result."
              :loading="table.loading"
              dense
              flat
              bordered
              ref="path_table"
            >
              <!-- Table Header -->
              <template v-slot:top>
                <!-- Top Left Side -->

                <!-- Refresh Path Table Button -->
                <q-btn
                  round
                  dense
                  color="secondary"
                  @click="getPath"
                  icon="refresh"
                >
                  <q-tooltip> Refresh Path List </q-tooltip>
                </q-btn>
                <!-- End Refresh Path Table Button -->

                <!-- Search component -->
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model="table.filter"
                  placeholder="Search"
                  style="padding-left: 30px"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <!-- End Search component -->

                <!-- Show hidden path Button -->
                <q-toggle
                  v-model="path.show_hidden"
                  label="Show hidden"
                  @input="updateTableData"
                >
                  <q-tooltip> Show hidden paths </q-tooltip>
                </q-toggle>
                <!-- End Show hidden path Button -->
                <!-- End Top Left Side -->

                <q-space />

                <!-- Top Mid Side -->

                <!-- Merge path component -->
                <div v-if="merge_path.active" class="q-gutter-sm">
                  <q-btn
                    color="primary"
                    label="merge"
                    @click="mergePath('merge')"
                  ></q-btn>
                  <q-btn
                    color="negative"
                    label="cancel"
                    @click="mergePath('cancel')"
                  ></q-btn>
                </div>
                <!-- End Merge path component -->

                <!-- Bulk action component -->
                <div
                  v-if="
                    path.selected_paths.length > 1 &&
                      merge_path.active === false
                  "
                  class="q-gutter-sm row"
                >
                  <q-select
                    label="Owner"
                    style="width: 100px"
                    outlined
                    v-model="bulk_action.owner"
                    :options="round.members"
                    :disable="permission === 'pentester'"
                    dense
                  />
                  <q-select
                    label="Target"
                    style="width: 100px"
                    outlined
                    v-model="bulk_action.target"
                    :options="general.path_target_list"
                    dense
                  />
                  <q-select
                    label="Functions"
                    style="min-width: 250px"
                    outlined
                    use-chips
                    multiple
                    v-model="bulk_action.functions"
                    :options="general.function_list"
                    option-label="function_name"
                    dense
                  />
                  <q-select
                    label="Status"
                    style="width: 100px"
                    outlined
                    v-model="bulk_action.status"
                    :options="general.path_status_list"
                    dense
                  />
                  <q-btn
                    color="primary"
                    style="width: 70px"
                    @click="updatePathBulk"
                    dense
                    >Save</q-btn
                  >
                </div>
                <!-- End Bulk action component -->

                <!-- End Top Mid Side -->

                <q-space />

                <!-- Top Right Side -->

                <!-- Import button component -->
                <q-btn
                  v-if="round.mbsd && permission !== 'pentester'"
                  color="secondary"
                  icon="mdi-cloud-upload-outline"
                  @click="activeImportPathMode"
                >
                  <q-tooltip> Import MBSD Overall Progress File </q-tooltip>
                </q-btn>
                <!-- End Import button component -->

                <!-- Export Testcase button component -->
                <q-btn
                  v-if="permission !== 'pentester'"
                  color="secondary"
                  icon="mdi-cloud-download-outline"
                  style="margin-left: 15px; margin-right: 15px"
                  @click="exportPathMemos"
                >
                  <q-tooltip> Export list Path and TestCase </q-tooltip>
                </q-btn>

                <q-btn
                  round
                  dense
                  icon="filter_alt"
                  @click="table.filter_dialog = true"
                >
                  <q-tooltip> Filter </q-tooltip>
                </q-btn>
                <!-- End Export Testcase button component -->

                <!-- End Top Right Side -->
              </template>
              <!-- End Table Header -->

              <!-- Table Body -->
              <template v-slot:body-cell-index="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.index }}
                </q-td>
              </template>

              <template v-slot:body-cell-name="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  <q-btn
                    icon="info"
                    style="float: right"
                    @click="toggleTestCaseDrawer(props.row)"
                    dense
                    flat
                  >
                    <q-tooltip> Show Testcase </q-tooltip>
                  </q-btn>
                  <div>
                    <b>
                      {{ props.row.name ? props.row.name : "." }}
                      <q-popup-edit
                        v-model="props.row.name"
                        @input="
                          updatePathField(props.row, 'name', ...arguments)
                        "
                        auto-save
                      >
                        <template v-slot="scope">
                          <q-input autofocus dense v-model="scope.value">
                          </q-input>
                        </template>
                      </q-popup-edit>
                      <q-tooltip> Click to edit </q-tooltip>
                    </b>
                  </div>
                  <q-space />
                  <p
                    style="
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      margin-bottom: 0px;
                    "
                  >
                    {{ props.row.url }}
                  </p>
                </q-td>
              </template>

              <template v-slot:body-cell-note="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.note }}
                  <q-popup-edit
                    v-model="props.row.note"
                    @input="updatePathField(props.row, 'note', ...arguments)"
                    auto-save
                  >
                    <template v-slot="scope">
                      <q-input autofocus dense v-model="scope.value"> </q-input>
                    </template>
                  </q-popup-edit>
                  <q-tooltip> Click to edit </q-tooltip>
                </q-td>
              </template>

              <template v-slot:body-cell-method="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.method }}
                </q-td>
              </template>

              <template v-slot:body-cell-status_code="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.status_code }}
                </q-td>
              </template>

              <template v-slot:body-cell-user="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.user }}
                </q-td>
              </template>

              <template v-slot:body-cell-owner="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  <q-select
                    outlined
                    v-model="props.row.owner"
                    :key="props.row.owner"
                    :options="round.members"
                    @input="updatePathField(props.row, 'owner', ...arguments)"
                    :disable="permission === 'pentester'"
                    dense
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-target="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  <q-select
                    outlined
                    :options="general.path_target_list"
                    :value="props.row.target"
                    :disable="permission === 'pentester'"
                    style="font-size: 20px"
                    @input="updatePathField(props.row, 'target', ...arguments)"
                    dense
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  <q-select
                    outlined
                    :options="general.path_status_list"
                    :value="props.row.status"
                    :disable="
                      permission === 'pentester' &&
                        props.row.status == 'Reviewed'
                    "
                    @input="updatePathField(props.row, 'status', ...arguments)"
                    dense
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-functions="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  <q-select
                    outlined
                    multiple
                    v-model="props.row.functions"
                    :options="general.function_list"
                    :disable="permission === 'pentester'"
                    use-chips
                    option-label="function_name"
                    @add="assignFunction(props.row, ...arguments)"
                    @remove="deleteFunction(props.row, ...arguments)"
                    ref="functions"
                    dense
                  >
                  </q-select>
                </q-td>
              </template>

              <template v-slot:body-cell-time="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.time }}
                </q-td>
              </template>

              <template v-slot:body-cell-checked_at="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.checked_at }}
                </q-td>
              </template>

              <template v-slot:body-cell-checked_by="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.checked_by }}
                </q-td>
              </template>

              <template v-slot:body-cell-reviewed_at="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.reviewed_at }}
                </q-td>
              </template>

              <template v-slot:body-cell-reviewed_by="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.reviewed_by }}
                </q-td>
              </template>

              <template v-slot:body-cell-created_type="props">
                <q-td :props="props" :style="rowClass(props.row)">
                  {{ props.row.created_type }}
                </q-td>
              </template>

              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:bottom="scope">
                <div v-if="path.selected_paths.length > 0">
                  {{ path.selected_paths.length }}
                  {{ path.selected_paths.length == 1 ? "path" : "paths" }}
                  selected
                </div>
                <q-space />

                <div v-if="table.filtered">
                  <q-btn
                    round
                    dense
                    flat
                    size="sm"
                    color="negative"
                    @click="resetFilterTable"
                    icon="clear"
                  >
                  </q-btn>
                  Clear Filter
                </div>

                <q-space />

                <q-select
                  v-model="table.pagination.rowsPerPage"
                  :options="table.pagination.rowsPerPageOptions"
                  :option-label="item => (item === 0 ? 'All' : item)"
                  style="margin-right: 10px; font-size: 12px"
                  class="rows-per-page"
                  hide-bottom-space
                  borderless
                  dense
                  options-dense
                />

                {{
                  1 + (scope.pagination.page - 1) * scope.pagination.rowsPerPage
                }}
                -
                {{
                  scope.pagination.rowsPerPage > 0
                    ? scope.pagination.page * scope.pagination.rowsPerPage >
                      table.data.length
                      ? table.data.length
                      : scope.pagination.page * scope.pagination.rowsPerPage
                    : table.data.length
                }}
                of {{ table.data.length }}

                <div v-if="scope.pagination.rowsPerPage > 0">
                  <q-btn
                    v-if="scope.pagesNumber > 2"
                    icon="first_page"
                    color="grey-8"
                    size="sm"
                    round
                    dense
                    flat
                    :disable="scope.isFirstPage"
                    @click="scope.firstPage"
                  />

                  <q-btn
                    icon="chevron_left"
                    color="grey-8"
                    size="sm"
                    round
                    dense
                    flat
                    :disable="scope.isFirstPage"
                    @click="scope.prevPage"
                  />

                  <q-btn
                    icon="chevron_right"
                    color="grey-8"
                    size="sm"
                    round
                    dense
                    flat
                    :disable="scope.isLastPage"
                    @click="scope.nextPage"
                  />

                  <q-btn
                    v-if="scope.pagesNumber > 2"
                    icon="last_page"
                    color="grey-8"
                    size="sm"
                    round
                    dense
                    flat
                    :disable="scope.isLastPage"
                    @click="scope.lastPage"
                  />
                </div>
              </template>

              <!-- End Table Body -->
            </q-table>
          </div>
          <!-- END PATH TABLE -->

          <!-- CONTEXT MENU -->
          <q-menu v-if="path.selected_path != null" touch-position context-menu>
            <q-list dense style="min-width: 200px">
              <!-- Path Detail -->
              <q-item clickable v-close-popup>
                <q-item-section @click="goToPathDetail(false)">
                  Detail
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section @click="goToPathDetail(true)">
                  Detail in new tab
                </q-item-section>
              </q-item>

              <q-item
                v-if="path.selected_path.main_path_id"
                clickable
                v-close-popup
              >
                <q-item-section @click="goToMainPathDetail">
                  Main Path Detail
                </q-item-section>
              </q-item>
              <!-- End Path Detail -->

              <!-- Action for this path -->
              <q-item
                v-if="
                  path.selected_path.history && path.selected_path.history.id
                "
                clickable
                v-close-popup
              >
                <q-item-section @click="rollbackPath">
                  Rollback
                </q-item-section>
              </q-item>

              <q-item
                v-if="path.selected_paths.length == 0"
                clickable
                v-close-popup
              >
                <q-item-section
                  v-if="path.selected_path.created_type != 'MERGED'"
                  @click="activeMergePathMode"
                >
                  Merge path
                </q-item-section>

                <q-item-section v-else @click="unmergeSelectedPath">
                  Unmerge path
                </q-item-section>
              </q-item>

              <q-item
                v-if="path.selected_paths.length == 0"
                clickable
                v-close-popup
              >
                <q-item-section
                  v-if="path.selected_path.created_type == 'HIDDEN'"
                  @click="unhideSelectedPath"
                >
                  Unhide path
                </q-item-section>

                <q-item-section v-else @click="hidePaths">
                  Hide path
                </q-item-section>
              </q-item>

              <q-item
                v-if="path.selected_paths.length > 0"
                clickable
                v-close-popup
              >
                <q-item-section @click="hidePaths">
                  {{
                    "Hide selected path (" + path.selected_paths.length + ")"
                  }}
                </q-item-section>
              </q-item>

              <q-item
                v-if="path.selected_paths.length > 0"
                clickable
                v-close-popup
              >
                <q-item-section @click="unhidePaths">
                  {{
                    "Unhide selected path (" + path.selected_paths.length + ")"
                  }}
                </q-item-section>
              </q-item>

              <!-- End Action for this path -->
            </q-list>
          </q-menu>
          <!-- END CONTEXT MENU -->
        </template>
        <!-- END PATH LIST COMPONENT -->

        <!-- INFO COMPONENT -->
        <template v-slot:after>
          <!-- REQUEST INFO COMPONENT -->
          <q-splitter v-model="splitterRight" :limits="[3, 97]">
            <template v-slot:before>
              <q-tabs v-model="tab" vertical class="text-teal">
                <q-tab name="request_info" icon="mdi-earth">
                  <q-tooltip> Request/Response </q-tooltip>
                </q-tab>
                <q-tab name="round_info" icon="mdi-chart-pie">
                  <q-tooltip> Round Info </q-tooltip>
                </q-tab>
                <q-tab name="member_info" icon="mdi-account-multiple">
                  <q-tooltip> Member Stats </q-tooltip>
                </q-tab>
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="tab"
                animated
                swipeable
                vertical
                transition-next="jump-up"
                transition-prev="jump-up"
                style="height: 100%"
              >
                <q-tab-panel name="request_info">
                  <RequestLog :path="path.selected_path"></RequestLog>
                </q-tab-panel>

                <q-tab-panel name="round_info">
                  <div class="row" v-if="round.data">
                    <div class="col">
                      <div
                        class="q-gutter-lg"
                        style="font-size: 15px; height: 100%"
                      >
                        <div class="">
                          <span class="text-h6">{{
                            round.data.display_name
                          }}</span>
                        </div>

                        <div class="">
                          <span class="text-bold">Start Date: </span>
                          {{ round.data.round_start_date }}
                        </div>

                        <div class="">
                          <span class="text-bold">End Date: </span>
                          {{ round.data.round_end_date }}
                        </div>

                        <div class="">
                          <span class="text-bold">Total Request: </span>
                          {{ path.total }}
                        </div>

                        <div class="">
                          <span class="text-bold">Note: </span>
                          <q-input
                            standout
                            readonly
                            v-model="round.data.round_note"
                            dense
                            label="Note"
                            type="textarea"
                            autogrow
                          ></q-input>
                        </div>
                      </div>
                    </div>

                    <div class="col">
                      <apexchart
                        :options="chart.round_status_chart.options"
                        :series="statusChartData"
                        height="320px"
                      >
                      </apexchart>
                    </div>

                    <div class="col">
                      <apexchart
                        :options="chart.progress_status_chart.options"
                        :series="progressChartData"
                        height="320px"
                      >
                      </apexchart>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="member_info">
                  <div class="row" v-if="round.data">
                    <div class="col">
                      <apexchart
                        :options="chart.member_overall_chart.options"
                        :series="memberOverallData"
                        height="320px"
                      >
                      </apexchart>
                    </div>

                    <div class="col">
                      <div class="text-center">
                        {{ chart.member_detail_chart.current_member }}
                      </div>
                      <apexchart
                        :options="chart.member_detail_chart.options"
                        :series="memberDetailData"
                        height="320px"
                      >
                      </apexchart>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
          <!-- END REQUEST INFO COMPONENT -->
        </template>
        <!-- END INFO COMPONENT -->
      </q-splitter>
    </div>

    <q-drawer :width="600" v-model="right_panel" side="right" elevated overlay>
      <q-page class="ub-page">
        <div class="q-ma-sm row text-h6">
          <div class="text-h6" style="max-width: 500px">
            {{ path.selected_path.name }}
          </div>
          <q-space />
          <q-btn icon="close" @click="right_panel = false" dense flat />
        </div>

        <TestCase
          :round_id="round.id"
          :path_id="testcase.selected_path_id"
        ></TestCase>
      </q-page>
    </q-drawer>

    <!-- Dialog Section -->
    <q-dialog v-model="import_path.active">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Import Excel</div>
          <q-separator />
        </q-card-section>
        <q-card-section>
          <div style="margin-bottom: 10px">
            <q-input
              filled
              v-model="import_path.sheet_name"
              label="Sheet Name"
              autogrow
              color="teal"
            ></q-input>
          </div>
          <div>
            <q-file
              color="teal"
              filled
              v-model="import_path.file"
              accept=".xlsx, .xls"
              label="Upload your file"
            >
              <template v-slot:prepend>
                <q-icon color="teal" name="cloud_upload"></q-icon>
              </template>
            </q-file>
          </div>
          <div>
            <q-checkbox
              v-model="import_path.include_sheet_name"
              label="Include sheet name in path name"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Push" color="teal" @click="importPath()"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="table.filter_dialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <q-form @submit="filterAction" class="q-gutter-md">
            <q-select
              v-for="(value, field) in table.filter_fields"
              :key="field"
              filled
              use-chips
              stack-label
              v-model="table.filter_fields[field]"
              :options="table.filter_options[field]"
              multiple
              :label="field"
            />

            <q-toggle v-model="table.filter_negative" label="Negative Match" />

            <div>
              <q-btn label="Filter" type="submit" color="primary" />
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- End Dialog Section -->
  </q-page>
</template>

<script>
import store from "@/store/store";
import CONST from "@/data/CONST.js";
import { QFile } from "quasar";
import utils from "@/utils.js";
import tracking_service from "@/services/TrackingService.js";
import management_service from "@/services/ManagementService.js";
import RequestLog from "@/views/components/RequestLog.vue";
import TestCase from "@/views/components/TestCase.vue";
import { scroll } from "quasar";
import Sortable from "sortablejs";

const LOADING_TIMEOUT = 1000;

export default {
  name: "PathList",
  components: {
    QFile,
    RequestLog,
    TestCase
  },
  props: ["table_scroll"],
  data() {
    return {
      // GENERAL properties
      right_panel: false,
      tab: "request_info",
      permission: "",
      splitterHorizon: 50,
      splitterRight: 2,
      general: {
        function_list: [],
        path_status_list: [],
        path_target_list: ["", "×", "△", "●", "○"]
      },

      // ROUND properties
      round: {
        id: "",
        data: null,
        members: [],
        reviewer: "",
        mbsd: false,
        working_dates: []
      },

      // PATH properties
      path: {
        data: [],
        total: 0,
        selected_path: {},
        selected_paths: [],
        next_page: null,
        show_hidden: false
      },

      testcase: {
        selected_path: {},
        selected_path_id: ""
      },

      // TABLE properties
      table: {
        data: [],
        dataTemp: null,
        fullData: [],
        columns: [
          {
            name: "index",
            field: row => row.index,
            align: "center",
            label: "#"
          },
          {
            name: "name",
            field: "name",
            align: "left",
            style: "min-width: 30vw; max-width: 30vw;",
            label: "Name",
            sortable: true
          },
          {
            name: "note",
            field: "note",
            align: "left",
            style: "min-width: 10vw; max-width: 10vw;",
            label: "Note"
          },
          {
            name: "method",
            field: row => row.method,
            align: "center",
            style: "min-width: 80px;",
            label: "Method"
          },
          {
            name: "status_code",
            field: row => row.status_code,
            align: "center",
            style: "min-width: 80px;",
            label: "Code",
            sortable: true
          },
          {
            name: "user",
            field: row => row.user,
            align: "center",
            style: "min-width: 80px;",
            label: "User",
            sortable: true
          },
          {
            name: "owner",
            field: row => row.owner,
            align: "center",
            style: "min-width: 100px;",
            label: "Owner",
            sortable: true
          },
          {
            name: "target",
            field: row => row.target,
            align: "center",
            style: "min-width: 100px;",
            label: "Target",
            sortable: true
          },
          {
            name: "status",
            field: "status",
            align: "center",
            style: "min-width: 150px;",
            label: "Status",
            sortable: true
          },
          {
            name: "functions",
            field: "functions",
            align: "left",
            style: "min-width: 250px;",
            label: "Functions"
          },
          // {
          //   name: "testcase",
          //   field: "testcase",
          //   align: "canter",
          //   style: "min-width: 100px;",
          //   label: "Testcase"
          // },
          // {
          //   name: "time",
          //   field: row => row.time,
          //   align: "left",
          //   style: "min-width: 100px;",
          //   label: "Time"
          // },
          {
            name: "checked_at",
            field: row => row.checked_at,
            align: "left",
            style: "min-width: 100px;",
            label: "Tested Date",
            sortable: true
          },
          {
            name: "checked_by",
            field: row => row.checked_by,
            align: "left",
            style: "min-width: 100px;",
            label: "Tested By",
            sortable: true
          },
          {
            name: "reviewed_at",
            field: row => row.reviewed_at,
            align: "left",
            style: "min-width: 120px;",
            label: "Reviewed Date",
            sortable: true
          },
          {
            name: "reviewed_by",
            field: row => row.reviewed_by,
            align: "left",
            style: "min-width: 120px;",
            label: "Reviewed By",
            sortable: true
          },
          {
            name: "created_type",
            field: row => row.created_type,
            align: "center",
            style: "min-width: 120px;",
            label: "Created Type",
            sortable: true
          }
        ],
        pagination: {
          rowsPerPage: 100,
          rowsPerPageOptions: [50, 100, 200, 0]
        },
        selected_row: null,
        filter: "",
        filtered: false,
        filter_dialog: false,
        filter_fields: {
          owner: [],
          target: [],
          status: [],
          checked_by: [],
          reviewed_by: []
        },
        filter_options: {
          owner: [],
          target: [],
          status: [],
          checked_by: [],
          reviewed_by: []
        },
        filter_negative: false,
        loading: false,
        changed: false,
        scroll: 0
      },

      next_page: null,
      splitterModelBottom: 150,
      splitterModelBottomRight: 50,
      selected_rows: [],
      //      path_table_key: 0,

      // TOOLBAR properties
      import_path: {
        active: false,
        sheet_name: "",
        file: null,
        include_sheet_name: false
      },

      merge_path: {
        active: false,
        selected_path: null,
        selected_row: null
      },

      draft_mode: false,

      bulk_action: {
        owner: null,
        functions: null,
        status: null,
        target: null
      },

      // CHART DATA
      chart: {
        round_status_chart: {
          options: {
            chart: {
              type: "pie"
            },
            title: {
              text: "Round Status",
              align: "center"
            },
            legend: {
              show: true,
              position: "right"
            },
            labels: CONST.ADMIN_PATH_STATUS_LIST,
            colors: CONST.ADMIN_PATH_STATUS_COLOR,
            tooltip: {
              enabled: true,
              fillSeriesColor: false
            }
            // responsive: [{
            //   breakpoint: 480,
            //   options: {
            //     chart: {
            //       width: 200
            //     },
            //     legend: {
            //       position: 'bottom'
            //     }
            //   }
            // }]
          },

          series: []
        },

        progress_status_chart: {
          options: {
            chart: {
              type: "radialBar"
            },

            title: {
              text: "Round Progress",
              align: "center"
            },

            labels: ["Current", "Expected"],
            colors: [
              function({ value, seriesIndex, w }) {
                var expected_value = w.config.series[1];
                var diff = expected_value - value;
                var color;

                if (diff <= 0) {
                  color = "#7CE449";
                } else if (diff >= 10 && diff < 20) {
                  color = "#E0AF28";
                } else {
                  color = "#FF0000";
                }
                // console.log(w.config.plotOptions.radialBar.dataLabels.total);
                w.config.plotOptions.radialBar.dataLabels.total.color = color;
                return color;
              },

              function({ value, seriesIndex, w }) {
                return "#44aaff";
              }
            ],
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    fontSize: "22px"
                  },
                  value: {
                    fontSize: "16px"
                  },
                  total: {
                    show: true,
                    label: "Current",
                    color: "#373d3f",
                    formatter: function(chart) {
                      // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                      return chart.config.series[0] + "%";
                    }
                  }
                }
              }
            }
            // responsive: [{
            //   breakpoint: 480,
            //   options: {
            //     chart: {
            //       width: 200
            //     },
            //     legend: {
            //       position: 'bottom'
            //     }
            //   }
            // }]
          },

          series: []
        },

        member_overall_chart: {
          series: [],
          options: {
            chart: {
              type: "bar",
              height: 350,
              stacked: true
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: "75%"
              }
            },
            stroke: {
              width: 1,
              colors: ["#fff"]
            },
            title: {
              text: "Member overall",
              align: "center"
            },
            xaxis: {
              categories: []
            },
            tooltip: {
              y: {
                formatter: function(val) {
                  return val + " Request";
                }
              }
            },
            fill: {
              opacity: 1
            },
            legend: {
              position: "bottom",
              horizontalAlign: "center"
            }
          }
        },

        member_detail_chart: {
          series: [],
          options: {
            chart: {
              height: 350,
              type: "bar"
            },
            plotOptions: {
              bar: {
                borderRadius: 10,
                dataLabels: {
                  position: "center" // top, center, bottom
                }
              }
            },
            tooltip: {
              x: {
                show: true
              },
              y: {
                formatter: function(val) {
                  return val;
                }
              }
            },
            dataLabels: {
              enabled: false
            },

            xaxis: {
              categories: [],
              type: "datetime"
            }
          },
          data: {},
          current_member: ""
        }
      }
    };
  },

  created() {
    this.init();
  },

  activated() {
    scroll.setScrollPosition(
      this.$refs.path_table.$el.children[1],
      this.table.scroll
    );
  },

  deactivated() {
    this.table.scroll = scroll.getScrollPosition(
      this.$refs.path_table.$el.children[1]
    );
  },

  mounted() {
    // It actually get the first table in component,
    // so if other table is placed above path list table, this code will failed
    var vue = this;
    this.path_table_body = this.$el.querySelector(".q-table > tbody");

    Sortable.create(this.path_table_body, {
      handle: ".q-checkbox",
      animation: 150,
      onUpdate({ oldIndex, newIndex }) {
        console.log(
          "Moving path from index " + oldIndex + " to index " + newIndex
        );
        // Only support move 1 path now despite API support move multiple paths
        var src_path_ids = [vue.table.data[oldIndex].id];

        var des_path_id;
        if (newIndex == 0) {
          des_path_id = "";
        } else {
          if (newIndex > oldIndex) {
            des_path_id = vue.table.data[newIndex].id;
          } else {
            des_path_id = vue.table.data[newIndex - 1].id;
          }
        }

        vue.movePath(src_path_ids, des_path_id).then(success => {
          utils.moveItemInArray(vue.table.data, oldIndex, newIndex);
          vue.updatePathIndex();
        });
      }
    });
  },

  // updated: function () {
  //   this.$nextTick(function () {

  //   })
  // },

  /*  beforeUpdate() {
    this.updatePathIndex();
  },*/

  computed: {
    statusChartData: function() {
      return utils.getRoundStatusChartData(this.path.data);
    },

    progressChartData: function() {
      return utils.getRoundProgressChartData(this.round.data, this.path.data);
    },

    memberOverallData: function() {
      return utils.getMemberOverallData(this.round.data, this.path.data);
    },

    memberDetailData: function() {
      return this.chart.member_detail_chart.data[
        this.chart.member_detail_chart.current_member
      ];
    },

    testcasePanelShow: function() {
      return this.right_panel;
    }
    // rowClass: function(rowObj) {
    //   console.log(rowObj);
    //   return "bg-green-2";
    // }
    // generalStatusList() {
    //   if (store.getters.permission !== "pentester") {
    //     return this.general.path_status_list;
    //   }
    //   return this.general.path_status_list.slice(0, 3);
    // },
    // permission() {
    //   return store.getters.permission;
    // }
    /* pathData() {
      this.updatePathIndex();
      return this.path.data;
    }*/
  },

  methods: {
    async init() {
      // INIT REQUIRED VARIABLES
      // this.permission = "pentester";
      this.permission = store.getters.permission;

      if (this.permission == "pentester") {
        this.general.path_status_list = CONST.PENTESTER_PATH_STATUS_LIST;
      } else {
        this.general.path_status_list = CONST.ADMIN_PATH_STATUS_LIST;
      }

      if (String(this.$route.params.round_id).includes("_draft")) {
        this.draft_mode = true;
      }
      this.round.id = String(this.$route.params.round_id);

      // CALL API TO GET REQUIRED INFORMATION TO RENDER PAGE

      // Get round info
      // Terminate process if cannot get round info
      var check = await this.getRoundInfo();
      if (!check) {
        if (this.$store.getters.authStatus == "success") {
          this.$router.push("/");
        }

        return;
      }

      // Get path list
      await this.getPath();
      // Scroll to path when return from path detail page

      if (this.table_scroll) {
        for (var i in this.table.data) {
          if (this.table.data[i].id == this.table_scroll) {
            this.$refs.path_table.scrollTo(this.table.data[i].index - 5);
            break;
          }
        }
      }

      // Get function list to render function select
      this.GetFunctionList();

      // Init filter options:
      this.InitFilterOptions();

      // Init chart info
      this.chart.round_status_chart.options.chart.events = {
        dataPointSelection: this.handleRoundStatusChartSelection
      };

      this.chart.member_overall_chart.options.xaxis.categories = this.round.data.round_members;
      this.chart.member_overall_chart.options.chart.events = {
        dataPointSelection: this.handleMemberOverallChartSelection
      };

      this.round.data.round_members.forEach(user => {
        this.chart.member_detail_chart.data[user] = utils.getMemberDetailData(
          this.round.data,
          this.path.data,
          user
        );
      });

      this.round.working_dates = utils
        .getDatesBetweenDates(
          this.round.data.round_start_date,
          this.round.data.round_end_date
        )
        .map(date => {
          return date.toLocaleDateString();
        });

      this.chart.member_detail_chart.options.xaxis.categories = this.round.working_dates.map(
        date => date + " GMT"
      );
      this.chart.member_detail_chart.current_member = this.round.data.round_members[0];
      this.chart.member_detail_chart.options.chart.events = {
        dataPointSelection: this.handleMemberDetailChartSelection
      };
    },

    getRoundInfo() {
      return tracking_service
        .GetRoundDetail(this.round.id.replace("_draft", ""))
        .then(data => {
          if (data === null) {
            return false;
          }

          this.round.data = data;
          this.round.members = data.round_members;
          this.round.reviewer = data.reviewer;

          var mbsd = false;
          if (data.project_type == "MBSD") {
            this.round.mbsd = true;
            mbsd = true;
          }

          this.table.columns = this.table.columns.filter(function(
            element,
            index,
            arr
          ) {
            if (mbsd) {
              return element.name != "index";
            } else {
              return element.name != "target" && element.name != "note";
            }
          });

          document.title = this.round.data.round_title;
          return true;
        });
    },

    // Call API get Path List
    async getPath() {
      this.table.loading = true;

      // Get minimized version of path list first
      await tracking_service.GetPathList(this.round.id, true).then(data => {
        if (data === null) {
          this.path.total = 0;
          this.path.data = [];
        } else {
          // utils.normalizePathData(data);

          this.path.total = data.length;
          this.path.data = data;
          this.updateTableData();
        }
      });

      // Then get full version of path list include hidden path but not update table data
      tracking_service.GetPathList(this.round.id, false).then(data => {
        if (data != null) {
          // utils.normalizePathData(data);
          this.path.data = data;
          this.updateTableData(false); // Not trigger loading
        }
      });

      this.table.loading = false;
    },

    // Call API get function list
    GetFunctionList() {
      return management_service.GetFunctionList().then(data => {
        if (data != null) {
          this.general.function_list = data;
        }
      });
    },

    // Parse path list to init filter options
    InitFilterOptions() {
      this.table.filter_options.owner = this.round.members;
      this.table.filter_options = utils.getPathAvailableValues(this.path.data);
    },

    rowClass(path) {
      var color = "";
      // There is only 2 color: Grey for merged and hide path and normal for others when in show_hidden mode

      if (this.path.show_hidden) {
        if (path.created_type == "MERGED" || path.created_type == "HIDDEN") {
          return "background-color: " + "#eee";
        }

        return;
      }

      if (path.status == "NotFound") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[0];
      }

      if (path.status == "NotTarget") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[1];
      }

      if (path.status == "Todo") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[2];
      }

      if (path.status == "Doing") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[3];
      }

      if (path.status == "Done") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[4];
      }

      if (path.status == "Pending") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[5];
      }

      if (path.status == "Recheck") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[6];
      }

      if (path.status == "Reviewed") {
        return "background-color: " + CONST.ADMIN_PATH_STATUS_COLOR[7];
      }

      return "";
    },

    // Search custom function, allow search on request URL
    filterMethod(rows, term) {
      var results = [];
      term = term.toLowerCase();

      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];

        if (row.name && row.name.toLowerCase().includes(term)) {
          results.push(row);
        } else if (row.url && row.url.toLowerCase().includes(term)) {
          results.push(row);
        }
      }

      return results;
    },

    // Update table data based on path data
    updateTableData(loading = true) {
      console.log("Updating table data");

      if (loading) {
        // Sleep a little bit to make everything more smooth
        this.table.loading = true;

        setTimeout(a => {
          this.table.loading = false;
        }, LOADING_TIMEOUT);
      }

      if (this.path.show_hidden) {
        this.table.fullData = this.path.data;
        // this.table.pagination.rowsPerPage = 100;
      } else {
        // this.table.pagination.rowsPerPage = 200;

        this.table.fullData = this.path.data.filter(element => {
          return (
            element.created_type != "HIDDEN" && element.created_type != "MERGED"
          );
        });
      }

      // table.fullData store all paths (hidden or not)
      // table.data store filtered paths
      this.updatePathIndex();
      this.table.data = this.table.fullData;

      this.path.selected_paths = [];
    },

    filterAction() {
      this.table.filter_dialog = false;
      this.filterTable(this.table.filter_fields, this.table.filter_negative);
    },

    // TODO: Need document this function
    filterTable(fields, negative = false) {
      this.table.loading = true;
      setTimeout(a => {
        this.table.loading = false;
      }, LOADING_TIMEOUT);

      var filteredData = this.table.fullData.filter(path => {
        if (!path.target) {
          return false;
        }
        var check = true;

        for (const field in fields) {
          const val = fields[field];

          if (val instanceof Object && !(val instanceof Array)) {
            const actualVal = val.value;
            const negative = val.negative;

            check = utils.checkFilterPath(path[field], actualVal);
            if (negative === true) {
              check = !check;
            }
          } else {
            check = utils.checkFilterPath(path[field], val);

            if (check === null) {
              check = true;
            } else {
              if (negative === true) {
                check = !check;
              }
            }
          }

          if (check == false) {
            break;
          }
        }

        return check;
      });

      this.table.data = filteredData;

      // this.table.loading = false;
      this.table.filtered = true;
      this.path.selected_paths = [];
    },

    // Call API update field(s) of single path
    rollbackPath() {
      if (this.path.selected_path != null) {
        return tracking_service
          .RollbackPath(
            this.path.selected_path.round,
            this.path.selected_path.id
          )
          .then(updated_path => {
            if (updated_path !== null) {
              this.updateTableRow({}, updated_path);
              return true;
            }

            return false;
          });
      }
    },

    resetFilterTable() {
      this.table.loading = true;
      setTimeout(a => {
        this.table.loading = false;
      }, LOADING_TIMEOUT);

      this.table.data = this.table.fullData;
      this.table.filtered = false;
      this.path.selected_paths = [];
    },

    // Update single row of table with new value
    updateTableRow(temp, updated_row) {
      const NOT_UPDATE_FIELDS = ["index", "request_log", "functions"];

      var localPath = null;
      for (var path of this.path.data) {
        if (updated_row.id == path.id) {
          localPath = path;
          break;
        }
      }

      for (var field in localPath) {
        if (NOT_UPDATE_FIELDS.includes(field)) {
          continue;
        }

        if (updated_row[field] !== localPath[field]) {
          localPath[field] = updated_row[field];
        }
      }
    },

    // Call API to assign function to path
    assignFunction(path, func) {
      func = func.value;

      // Empty testcase drawer
      this.testcase.selected_path_id = "";

      return tracking_service
        .AssignFunction(path.round, path.id, func.id)
        .then(result => {
          if (result != null) {
            this.updateTableRow(path, result);
            this.testcase.selected_path_id = this.path.selected_path.id;
          }
        });
    },

    // Call API to delete function from path
    deleteFunction(path, func) {
      func = func.value;

      return tracking_service
        .AssignFunction(path.round, path.id, func.id, true)
        .then(result => {
          if (result != null) {
            this.updateTableRow(path, result);
          }
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
        .UpdatePath(this.round.id, path.id, field, value)
        .then(updated_path => {
          if (updated_path !== null) {
            this.updateTableRow(path, updated_path);
            return true;
          }

          return false;
        });
    },

    // Re-indexing path in table.data
    updatePathIndex() {
      // Only update if project is not mbsd
      // if (this.round.mbsd) {
      //   return;
      // }

      this.table.fullData.forEach((row, index) => {
        if (row.index != index + 1) {
          row.index = index + 1;
        }
      });
      //this.forceRerenderTable();

      // Trigger Table to re-update index of row ??????? Why ?????
      if (this.table.fullData.length > 0) {
        this.table.fullData[0].reviewed_at = this.table.fullData[0].reviewed_at
          ? this.table.fullData[0].reviewed_at + " "
          : " ";
      }
      // this.table.changed = !this.table.changed;
    },

    // Delete selected path (on client-side only)
    deleteSelectedPath() {
      if (!this.path.show_hidden) {
        // this.table.fullData.splice(this.path.selected_path.index - 1, 1);
        utils.removeItemFromArray(this.table.data, this.path.selected_path);
        this.path.selected_path = {};
        this.path.total = this.path.total - 1;
        this.updatePathIndex();
      }
    },

    // Delete selected paths (on client-side only)
    deleteSelectedPaths() {
      if (!this.path.show_hidden) {
        var selected_path_ids = this.path.selected_paths.map(x => x.id);

        var filter = this.table.data.filter(function(value, index, arr) {
          return !selected_path_ids.includes(value.id);
        });

        this.table.data = filter;
        this.path.selected_paths = [];
        this.path.total = this.table.data.length;
        this.updatePathIndex();
      }
    },

    // Call API hide path(s)
    hidePaths() {
      if (this.path.selected_paths.length > 0) {
        // Update selected paths when in selection mode
        this.updatePaths("update", { created_type: "HIDDEN" }).then(success => {
          if (success) {
            this.deleteSelectedPaths();
          }
        });
      } else {
        // If no selected path, update path which is open context menu
        this.updatePathField(
          this.path.selected_path,
          "created_type",
          "HIDDEN"
        ).then(success => {
          if (success) {
            this.deleteSelectedPath();
          }
        });
      }
    },

    unhidePaths() {
      if (this.path.selected_paths.length > 0) {
        // Update selected paths when in selection mode
        this.updatePaths("update", { created_type: "" }).then(success => {});
      }
    },

    // Bulk update
    updatePathBulk() {
      var fields = {};
      for (const key in this.bulk_action) {
        if (this.bulk_action[key] != null) {
          fields[key] = this.bulk_action[key];
        }
      }

      this.updatePaths("update", fields).then(success => {
        if (success) {
          this.bulk_action.owner = null;
          this.bulk_action.functions = null;
          this.bulk_action.status = null;
        }
      });
    },

    // Call API update field(s) of selected paths
    updatePaths(action, fields) {
      var selected_path_ids = this.path.selected_paths.map(x => x.id);

      return tracking_service
        .UpdatePaths(this.round.id, selected_path_ids, action, fields)
        .then(result => {
          // Update table field if update sucess
          if (result != null) {
            this.path.selected_paths.forEach((element, index) => {
              // Update path data based on input field since response return only success status
              if (action == "update") {
                // for (const field in fields) {
                //   element[field] = fields[field];
                // }
                this.updateTableRow(element, result[index]);
              }

              // Delete selected paths from client-side
              // if (action == "delete") {
              //   this.deleteSelectedPaths();
              // }
            });

            return true;
          }

          return false;
        });
    },

    // Call API to move path to destination
    movePath(src_path_ids, des_path_id) {
      return tracking_service
        .MovePath(this.round.id, src_path_ids, des_path_id)
        .then(data => {
          if (data != null) {
            return true;
          }

          return false;
        });
    },

    // unmerge Path
    async unmergeSelectedPath() {
      if (this.path.selected_path == null) {
        return;
      }

      var success = await this.updatePathField(
        this.path.selected_path,
        "main_path_id",
        ""
      );

      if (success) {
        this.updatePathField(this.path.selected_path, "created_type", "");
      }
    },

    // unhide Path
    unhideSelectedPath() {
      if (this.path.selected_path == null) {
        return;
      }

      this.updatePathField(this.path.selected_path, "created_type", "");
    },

    // Select range of path by Ctrl + Click
    onRowSelection({ rows, added, evt }) {
      // Select all row between 2 selected rows
      if (
        evt !== undefined && // Check if event exist (It's not exist when select all)
        (evt.ctrlKey || evt.metaKey) && // Check hold Ctrl or Meta key
        added && // Check if row were selected
        rows.length == 1 && // Check if only add 1 row
        this.path.selected_paths.length == 1 // Check if currently 1 row is selected
      ) {
        console.log("Gotcha");
        var topRow =
          rows[0].index < this.path.selected_paths[0].index
            ? rows[0]
            : this.path.selected_paths[0];
        var botRow =
          rows[0].index > this.path.selected_paths[0].index
            ? rows[0]
            : this.path.selected_paths[0];

        for (var i = topRow.index; i < botRow.index - 1; i++) {
          rows.push(this.table.data[i]);
        }
      }
    },

    handleRightClickEvent(evt, rowObj, index) {
      console.log(rowObj);
      console.log(evt);
      this.path.selected_path = rowObj;
      this.table.selected_row = evt.target.parentElement;
      // this.path.selected_paths = [];

      // Debug code :)
      // console.log(
      //   utils.getRoundProgressChartData(this.round.data, this.path.data)
      // );
    },

    handleClickEvent(evt, rowObj, index) {
      this.path.selected_path = rowObj;
      this.table.selected_row = evt.target.parentElement;
    },

    handleDbClickEvent(evt, rowObj, index) {
      console.log(rowObj);
    },

    testEvent(a, b) {
      console.log("Test Event");
      console.log(a);
      a.status = b;
      console.log(b);
      return "Done";
    },

    // Go to Detail
    goToPathDetail(new_tab) {
      if (this.path.selected_path != null) {
        var path_detail = this.$router.resolve({
          name: "PathDetail",
          params: {
            path_id: this.path.selected_path.id,
            round_id: this.path.selected_path.round,
            path: this.path.selected_path
          }
        });

        if (new_tab) {
          window.open(path_detail.href, "_blank");
        } else {
          this.$router.push(path_detail.resolved);
        }
      }
    },

    // Go to Main Path Detail
    goToMainPathDetail() {
      if (this.path.selected_path != null) {
        let routeData = this.$router.resolve({
          name: "PathDetail",
          params: {
            path_id: this.path.selected_path.main_path_id,
            round_id: this.path.selected_path.round
          }
        });
        window.open(routeData.href, "_blank");
      }
    },

    // Import MBSD overall file
    importPath() {
      tracking_service
        .ImportMBSDFile(
          this.round.id,
          this.import_path.file,
          this.import_path.sheet_name,
          this.import_path.include_sheet_name
        )
        .then(result => {
          if (result != null) {
            this.path.data = result;
            this.updateTableData();
            this.deactiveImportPathMode();
          }
        });
    },

    // export Round path and testcase
    exportPathMemos() {
      tracking_service.ExportMemo(this.round.id).then(data => {
        if (data !== null) {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.round.data.round_title + ".xlsx"); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      });
    },

    activeImportPathMode() {
      this.import_path.active = true;
    },

    deactiveImportPathMode() {
      this.import_path = {
        active: false,
        sheet_name: "",
        file: null,
        include_sheet_name: false
      };
    },

    activeMergePathMode() {
      this.merge_path.active = true;
      this.merge_path.selected_path = this.path.selected_path;
      this.merge_path.selected_row = this.table.selected_row;
      this.merge_path.selected_row.style.backgroundColor = "#e0f3ff";
    },

    deactiveMergePathMode() {
      this.merge_path.active = false;
      this.merge_path.selected_path = {};
      this.merge_path.selected_row.style.backgroundColor = "inherit";
      this.merge_path.selected_row = null;
    },

    async mergePath(action) {
      if (action === "cancel") {
        this.path.selected_paths = [];
      } else {
        var sub_path_ids = this.path.selected_paths.map(x => x.id);
        var main_path_id = this.merge_path.selected_path.id;
        await tracking_service
          .MergePath(this.round.id, main_path_id, sub_path_ids)
          .then(data => {
            if (data !== null) {
              // Update main path by data from server
              this.updateTableRow(this.merge_path.selected_path, data);

              // Update sub paths on client-side only
              this.path.selected_paths.forEach(e => {
                e.main_path_id = data.id;
                e.created_type = "MERGED";
              });

              // Move merged path below main path
              this.movePath(sub_path_ids, main_path_id).then(success => {
                if (success) {
                  this.deleteSelectedPaths();
                  this.updatePathIndex();
                }
              });
            }
          });
      }
      this.deactiveMergePathMode();
    },

    handleRoundStatusChartSelection(event, chartContext, selection) {
      if (selection.selectedDataPoints[0].length != 0) {
        var selected_status_index = selection.selectedDataPoints[0][0];
        var selected_status =
          CONST.ADMIN_PATH_STATUS_LIST[selected_status_index];
        this.filterTable({ status: selected_status });
      } else {
        this.resetFilterTable();
      }
    },

    handleMemberOverallChartSelection(event, chartContext, selection) {
      // const status_list = ["Finished", "Remain"];

      if (selection.selectedDataPoints[selection.seriesIndex].length != 0) {
        var owner = this.round.data.round_members[selection.dataPointIndex];
        var status = selection.seriesIndex; // 0 == "Finished", 1 == "Remain"

        if (status == 0) {
          // Finished
          const filterFields = {
            owner: owner,
            status: ["Done", "Reviewed"]
          };

          this.filterTable(filterFields);
        }

        if (status == 1) {
          // Remain
          const filterFields = {
            owner: {
              value: owner
            },
            status: {
              value: ["Done", "Reviewed"],
              negative: true
            }
          };

          this.filterTable(filterFields);
        }

        // Render member detail chart too
        this.chart.member_detail_chart.current_member = owner;
      } else {
        this.resetFilterTable();
      }
    },

    handleMemberDetailChartSelection(event, chartContext, selection) {
      if (selection.selectedDataPoints[0].length != 0) {
        var user = this.chart.member_detail_chart.current_member;
        var selected_date = this.round.working_dates[selection.dataPointIndex];
        this.filterTable({ owner: user, checked_at: selected_date });
      } else {
        this.resetFilterTable();
      }
    },

    toggleTestCaseDrawer(selected_path) {
      if (this.right_panel) {
        if (this.testcase.selected_path_id != selected_path.id) {
          this.testcase.selected_path_id = selected_path.id;
        } else {
          this.right_panel = false;
        }
      } else {
        this.testcase.selected_path_id = selected_path.id;
        this.right_panel = true;
      }
    }
  }
};
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: anywhere; /* Internet Explorer 5.5+ */
}

.swal2-container {
  z-index: 100000000000 !important;
}

td {
  word-wrap: break-word;
}

tr > .status-done {
  background-color: #42b983;
}

.rows-per-page .q-field__control {
  min-height: inherit !important;
}

.rows-per-page .q-field__native {
  min-height: inherit !important;
}

.rows-per-page .q-field__append {
  height: inherit !important;
}
</style>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: inherit

  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ddeeff

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
