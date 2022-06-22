<template>
  <q-splitter v-model="splitterModelBottom">
    <template v-slot:before>
      <div>
        <q-splitter v-model="splitterModelBottomRight">
          <template v-slot:before>
            <div class="q-pa-md">
              <div class="text-bold">Request</div>
              <q-scroll-area style="height: 35vh;">
                <pre v-highlightjs="request_log.request">
                  <code class="http"></code>
                </pre>
              </q-scroll-area>
            </div>
          </template>

          <template v-slot:after>
            <div class="q-pa-md">
              <div class="text-bold">Response</div>
              <q-scroll-area style="height: 35vh;">
                <pre v-highlightjs="request_log.response">
                  <code class="http"></code>
                  <q-btn v-if="request_log.expand" icon="more_horiz" @click="expandBody" dense flat >
                    <q-tooltip>
                      Expand Body (Very Long)
                    </q-tooltip>
                  </q-btn>
                </pre>
              </q-scroll-area>
            </div>
          </template>
        </q-splitter>
        <q-inner-loading
          :showing="request_log.loading"
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
    </template>

    <template v-slot:after>
      <div class="q-pa-md">
        <div class="text-bold">Inspector</div>
      </div>

      <q-expansion-item label="Request Cookies">
        <q-table
          :columns="request_log.columns_cookies"
          :data="request_log.cookies"
          hide-bottom
          hide-header
          dense
          flat
        ></q-table>
      </q-expansion-item>

      <q-expansion-item label="Request Parameters">
        <q-table
          :columns="request_log.columns_params"
          :data="request_log.params"
          hide-bottom
          hide-header
          dense
          flat
        ></q-table>
      </q-expansion-item>
    </template>
  </q-splitter>
</template>

<script>
import tracking_service from "@/services/TrackingService.js";
import utils from "@/utils.js";

export default {
  name: "RequestLog",
  props: ["path", "request"],
  components: {},
  data() {
    return {
      splitterModelBottom: 150,
      splitterModelBottomRight: 50,
      request_log_cached: new Map(),
      request_log: {
        full_request: {},
        request: null,
        response: null,
        columns_cookies: [
          { name: "name", align: "left", field: "name" },
          { name: "value", align: "left", field: "value" }
        ],
        columns_params: [
          { name: "name", align: "left", field: "name" },
          { name: "value", align: "left", field: "value" }
        ],
        cookies: [],
        params: [],
        loading: false,
        expand: false
      }
    };
  },
  watch: {
    path(newVal) {
      if (newVal) {
        this.renderRequestLog(true);
      }
    },
    request(newVal) {
      if (newVal) {
        this.renderRequestLog(false);
      }
    }
  },
  methods: {
    async renderRequestLog(from_path) {
      var request_id;
      this.request_log.expand = false;

      if (from_path) {
        request_id = this.path.request_log_id;
        // Empty request log
        if (!request_id) {
          this.request_log.request = this.path.url;
          this.request_log.response = "No data";
          this.request_log.cookies = [];
          this.request_log.params = [];
          return;
        }
      } else {
        request_id = this.request.id;
      }

      this.request_log.loading = true;

      // Get request log from cached or API
      var request_log;

      if (this.request_log_cached.has(request_id)) {
        request_log = this.request_log_cached.get(request_id);
      } else {
        var request_log = await tracking_service.GetESRequest(request_id);
        if (request_log == null) {
          console.log("[ERROR] Cannot get es request id: " + request_id);
          this.request_log.loading = false;
          return;
        } else {
          this.request_log_cached.set(request_id, request_log);
        }
      }

      this.request_log.full_request = request_log;

      // Render request log
      this.request_log.cookies = [];
      this.request_log.params = [];

      this.request_log.request = utils.htmlEntities(
        utils.b64DecodeUnicode(request_log.request.as_base_64)
      );

      if (
        request_log.response.as_base_64.length != 0 &&
        request_log.response.as_base_64.length < 10000
      ) {
        this.request_log.response = utils.htmlEntities(
          utils.b64DecodeUnicode(request_log.response.as_base_64)
        );
      } else {
        if (request_log.response.as_base_64.length != 0) {
          this.request_log.expand = true;
        }

        this.request_log.response = utils.htmlEntities(
          request_log.response.headers
        );
      }

      if (request_log.request.has_sent_cookies) {
        var cookies = request_log.request.cookies;

        cookies.forEach(cookie => {
          this.request_log.cookies.push({
            name: cookie.Name,
            value: cookie.Value
          });
        });
      }

      if (request_log.request.has_params) {
        var parameters = request_log.request.parameters;

        for (const param in parameters) {
          this.request_log.params.push({
            name: param,
            value: parameters[param]
          });
        }
      }

      this.request_log.loading = false;
    },

    expandBody() {
      this.request_log.expand = false;
      this.request_log.response = utils.htmlEntities(
        utils.b64DecodeUnicode(
          this.request_log.full_request.response.as_base_64
        )
      );
    }
  }
};
</script>
