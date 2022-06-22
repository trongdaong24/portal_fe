<template>
  <q-page class="ub-page">
    <div class="row items-center" style="margin-bottom:10px;">
      <div class="col-md-12 q-ma-xs">
        <span class="text-h6">Path List ( {{ totalData }})</span>
        <q-btn
          color="secondary"
          label="Import"
          icon="mdi-cloud-upload-outline"
          style="float:right"
          @click="uploadFileDialog = true"
        ></q-btn>
      </div>
    </div>
    <div class="row items-center">
      <div class="col-md-12">
        <q-table
          :columns="columns"
          :data="data"
          row-key="id"
          virtual-scroll
          style="height: 400px"
          :wrap-cells="true"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          @virtual-scroll="scrolling"
          @row-contextmenu="handleEvent"
          @row-click="OnRowClick"
          virtual-scroll-slice-size="10000"
          hide-bottom
          flat
          bordered
          id="contextmenu"
        >
          <template v-slot:body-cell-user="props">
            <q-td :props="props">
              <q-select
                outlined
                v-model="props.row.request_log.user"
                :options="users"
                dense
              />
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-select
                outlined
                v-model="props.row.status"
                :options="status"
                dense
              />
            </q-td>
          </template>
          <!--
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="round_order" :props="props">
                                {{ props.row.round_order }}
                            </q-td>

                            <q-td key="name" :props="props">
                                {{ props.row.name }}
                            </q-td>

                            <q-td key="hostname" :props="props">
                                {{ props.row.request_log.request.hostname }}
                            </q-td>

                            <q-td key="method" :props="props">
                                {{ props.row.request_log.request.method }}
                            </q-td>

                            <q-td key="path" :props="props">
                                {{ props.row.request_log.request.path }}
                            </q-td>

                            <q-td key="mime" :props="props">
                                {{ props.row.request_log.response.mime_type }}
                            </q-td>

                            <q-td key="timestamp" :props="props">
                                {{ props.row.request_log.time }}
                            </q-td>

                            <q-td key="user" :props="props">
                             <q-select outlined v-model="props.row.request_log.user" :options="users" dense />
                            </q-td>

                            <q-td key="functions" :props="props">
                                {{ props.row.functions }}
                            </q-td>

                            <q-td key="status" :props="props">
                             <q-select outlined v-model="props.row.status" :options="status" dense />
                            </q-td>
                        </q-tr>
                    </template>
                    -->
        </q-table>

        <q-menu touch-position context-menu target="#contextmenu">
          <q-list dense style="min-width:200px">
            <q-item clickable v-close-popup>
              <q-item-section @click="GoToDetail">go to detail</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>

    <div>
      <q-splitter v-model="splitterModelBottom" style="height:450px;">
        <template v-slot:before>
          <div>
            <q-splitter
              v-model="splitterModelBottomRight"
              style="height:450px;"
            >
              <template v-slot:before>
                <div class="q-pa-md">
                  <div class="text-h6 q-mb-md">Request</div>
                  <pre
                    v-highlightjs="http_request"
                  ><code class="http"></code></pre>
                </div>
              </template>

              <template v-slot:after>
                <div class="q-pa-md">
                  <div class="text-h6 q-mb-md">Response</div>
                  <pre
                    v-highlightjs="http_response"
                  ><code class="http"></code></pre>
                </div>
              </template>
            </q-splitter>
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md">
            <div class="text-h6 q-mb-md">Inspector</div>
          </div>
          <q-expansion-item label="Request Cookies">
            <q-table
              :columns="columns_cookies"
              :data="data_cookies"
              hide-bottom
              hide-header
              dense
              flat
            ></q-table>
          </q-expansion-item>
          <q-expansion-item label="Request Parameters"></q-expansion-item>
        </template>
      </q-splitter>
    </div>

    <!-- Dialog Section -->
    <q-dialog v-model="uploadFileDialog">
      <q-card style="width:300px">
        <q-card-section>
          <div class="text-h6">Import Excel</div>
          <q-separator />
        </q-card-section>
        <q-card-section>
          <div style="margin-bottom:10px;">
            <q-input
              filled
              v-model="fileName"
              label="Name"
              autogrow
              color="teal"
            ></q-input>
          </div>
          <div>
            <q-file
              color="teal"
              filled
              v-model="file"
              accept=".xlsx, .xls"
              label="Upload your file"
            >
              <template v-slot:prepend>
                <q-icon color="teal" name="cloud_upload"></q-icon>
              </template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Push" color="teal" @click="pushFile()"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import client from "@/services/client.js";
import { PATH_LIST_URL } from "@/data/URL.js";
import { QFile } from "quasar";
import axios from "axios";
import { getHeader } from "@/services/config.js";

export default {
  name: "PathList",
  components: {
    QFile
  },
  data() {
    return {
      columns: [
        {
          name: "round_order",
          field: "round_order",
          align: "center",
          style: "width:50px",
          headerStyle: "width:50px"
        },
        {
          name: "name",
          field: "name",
          align: "left",
          style: "width:200px",
          headerStyle: "width:200px",
          label: "Name"
        },
        {
          name: "hostname",
          field: row => row.request_log.request.hostname,
          align: "left",
          style: "width:200px",
          headerStyle: "width:200px",
          label: "Host"
        },
        {
          name: "method",
          field: row => row.request_log.request.method,
          align: "left",
          style: "width:70px",
          headerStyle: "width:70px",
          label: "Method"
        },
        {
          name: "path",
          field: row => row.request_log.request.path,
          align: "left",
          style: "width: 500px",
          headerStyle: "width:500px",
          label: "Path"
        },
        {
          name: "mime",
          field: row => row.request_log.response.mime_type,
          align: "left",
          style: "width:100px",
          headerStyle: "width:100px",
          label: "Mime"
        },
        {
          name: "timestamp",
          field: row => row.request_log.time,
          align: "left",
          style: "width:200px",
          headerStyle: "width:200px",
          label: "@Timestamp"
        },
        {
          name: "user",
          field: row => row.request_log.user,
          align: "left",
          style: "width:200px",
          headerStyle: "width:200px",
          label: "User"
        },
        {
          name: "functions",
          field: "functions",
          align: "left",
          style: "width:200px",
          headerStyle: "width:200px",
          label: "Functions"
        },
        {
          name: "status",
          field: "status",
          align: "left",
          style: "width:150px",
          headerStyle: "width:150px",
          label: "Status"
        }
      ],
      data: [],
      pagination: {
        rowsPerPage: 0
      },
      nextpage: null,
      totalData: 0,
      users: [],
      status: [],
      rowContextMenu: null,
      uploadFileDialog: false,
      fileName: "",
      file: null,
      splitterModelBottom: 150,
      splitterModelBottomRight: 50,
      http_response: "",
      http_request: "",
      data_cookies: [],
      columns_cookies: [
        { name: "name", align: "left", field: "name" },
        { name: "value", align: "left", field: "value" }
      ]
    };
  },
  created() {
    this.getPath(
      PATH_LIST_URL.replace(":round_id", this.$route.params.round_id)
    );
  },

  mounted() {},

  methods: {
    getPath(url) {
      client
        .get(url)
        .then(response => {
          this.innerHandle(response);
        })
        .catch(error => {
          console.log("There was an error: " + error);
        });
    },

    innerHandle(response) {
      this.data = this.data.concat(response.data.results);
      this.nextpage = response.data.next;
      this.totalData = response.data.count;
      (this.users = ["duongdt27", "linhtd14", "lamtn51", "tuanda27"]),
        (this.status = ["not evaluated", "pass", "issue"]);
    },

    scrolling(e) {
      if (e.index === e.to && this.nextpage != null) {
        this.getPath(this.nextpage);
      }
    },

    handleEvent(evt, row, index) {
      this.rowContextMenu = row;
      //console.log("row",row);
      //console.log("index",index);
    },

    OnRowClick(evt, row, index) {
      console.log(row);
      this.data_cookies = [];
      this.http_request = atob(row.request_log.request.as_base_64);
      this.http_response = this.htmlEntities(
        atob(row.request_log.response.as_base_64)
      );
      if (row.request_log.request.has_sent_cookies) {
        var cookies = row.request_log.request.cookie_string.split(";");
        cookies.forEach(cookie => {
          cookie = cookie.trim().split("=");
          this.data_cookies.push({
            name: cookie[0],
            value: cookie[1]
          });
        });
      }
    },

    htmlEntities(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },

    GoToDetail() {
      if (this.rowContextMenu != null) {
        let routeData = this.$router.resolve({
          name: "PathDetail",
          params: {
            path_id: this.rowContextMenu.id,
            round_id: this.rowContextMenu.round
          }
        });
        window.open(routeData.href, "_blank");
      }
    },

    showAlertSuccess() {
      this.$swal.fire({
        text: "file has been successfully uploaded",
        icon: "success",
        toast: true,
        position: "top-end",
        timerProgressBar: true,
        timer: 3000,
        showConfirmButton: false
      });
    },

    pushFile() {
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("name", this.fileName);
      var headers = getHeader();
      headers["Content-Type"] = "multipart/form-data";
      axios
        .post("/api/" + this.$route.path + "/import_mbsd/", formData, {
          headers: headers
        })
        .then(response => {
          this.uploadFileDialog = false;
          this.fileName = "";
          this.file = null;
          this.showAlertSuccess();
        });
    }
  }
};
</script>

<style>
pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.swal2-container {
  z-index: 100000000000 !important;
}
</style>
