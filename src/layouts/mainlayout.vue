<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="text-grey-4 db-toolbar" height-hint="98">
      <q-toolbar>
        <q-btn
          dense
          flat
          icon="img:/logo-dark.png"
          type="a"
          href="/"
          target="_blank"
        />

        <q-toolbar-title style="padding-left: 4px">
          Tracking NightWolf
          <!--          <breadcrumb></breadcrumb> -->
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn-dropdown
          label="Manager"
          unelevated
          no-caps
          v-if="permission === 'manager'"
        >
          <q-list>
            <q-item clickable v-close-popup href="/manager/testcase">
              <q-item-section>
                <q-item-label>Test Case</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-list>
            <q-item clickable v-close-popup href="/manager/statistic">
              <q-item-section>
                <q-item-label>Statistic</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn label="Round" href="/" no-caps unelevated />
        <!--        <q-item tag="label" v-ripple>
          <q-item-section side>
            <q-toggle v-model="dark" icon="brightness_medium"></q-toggle>
          </q-item-section>
        </q-item>        
-->
        <q-btn-dropdown unelevated v-model="userInfoOpen" no-caps>
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar size="sm">
                <img src="/images/avatars/male/1.png" />
              </q-avatar>
              <div class="text-center q-pa-sm">
                {{ username }}
              </div>
            </div>
          </template>
          <user-info></user-info>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <transition :name="transitionName">
        <keep-alive :max="10"
          ><router-view :key="$route.fullPath"
        /></keep-alive>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
import UserInfo from "../components/user/userinfo.vue";
import store from "@/store/store";
//import breadcrumb from "../components/breadcrumb.vue";

export default {
  name: "MainLayout",
  components: {
    UserInfo,
    //    breadcrumb
  },
  data() {
    return {
      username: "",
      userInfoOpen: false,
      transitionName: "",
    };
  },
  computed: {
    permission() {
      return store.getters.permission;
    },
    dark: {
      get() {
        return this.$store.state.layout.dark;
      },
      set(value) {
        this.setDark({ dark: value });
      },
    },
  },
  watch: {
    dark: {
      handler: function (val) {
        this.$q.dark.set(val);
      },
    },
  },
  mounted() {
    this.$q.dark.set(this.dark);
    if (localStorage.username) {
      this.username = localStorage.username;
    }
  },
  methods: {
    ...mapActions({
      setDark: "layout/setDark",
    }),
    initialize() {
      let dbc = dbColors;

      //this.testColors = dbColors.getColors(true); // TEMP TODO REMOVE
      let cSteps = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

      dbColors.setColorScheme("default", {
        light: dbColors.d3ScaleChromatic.schemeTableau10,
        dark: dbColors.grafanaColors,
      });

      dbColors.setColorScheme("Grafana", {
        light: dbColors.grafanaColors,
        dark: dbColors.grafanaColors,
      });

      dbColors.setColorScheme("Tableau", {
        light: dbColors.d3ScaleChromatic.schemeTableau10,
        dark: dbColors.d3ScaleChromatic.schemeTableau10,
      });

      dbColors.setColorScheme("Diverging", {
        light: dbColors.d3ScaleChromatic.schemeRdYlBu[10],
        dark: dbColors.d3ScaleChromatic.schemeRdYlBu[10],
      });

      dbColors.setColorScheme("Categorical", {
        light: dbColors.d3ScaleChromatic.schemeDark2,
        dark: dbColors.d3ScaleChromatic.schemeSet3, // schemeBuGn[9],
      });

      dbColors.setColorScheme("Warm", {
        light: cSteps.map((x) => dbColors.d3ScaleChromatic.interpolateWarm(x)),
        dark: cSteps.map((x) => dbColors.d3ScaleChromatic.interpolateWarm(x)),
      });

      dbColors.setColorScheme("Cool", {
        light: cSteps.map((x) => dbColors.d3ScaleChromatic.interpolateCool(x)),
        dark: cSteps.map((x) => dbColors.d3ScaleChromatic.interpolateCool(x)),
      });

      dbColors.setColorScheme("Calm", {
        light: [
          "#912e4d",
          "#00bd56",
          "#f02192",
          "#acd36d",
          "#8079ff",
          "#919200",
          "#f1adff",
          "#547600",
          "#ff8241",
          "#f8ba7a",
        ],
        dark: [
          "#ce4c3a",
          "#60b14d",
          "#8162cb",
          "#bab141",
          "#c964b5",
          "#4bb092",
          "#c25874",
          "#717e37",
          "#688ccd",
          "#c78344",
        ],
      });
      //['#cc4ba2', '#64ac48', '#8361cd', '#9a963f', '#5f8cce', '#cd5136', '#4aac8d', '#c7596d', '#c78543', '#b578b6']
      //['#ce4c3a', '#60b14d', '#8162cb', '#bab141', '#c964b5', '#4bb092', '#c25874', '#717e37', '#688ccd', '#c78344']

      dbColors.setColorScheme("Fancy", {
        light: [
          "#38646f",
          "#4e2300",
          "#274f8e",
          "#6b5e1f",
          "#794f81",
          "#2a2e00",
          "#00485e",
          "#7c553f",
          "#2e0a06",
          "#2b2219",
        ],
        dark: [
          "#b1d8a0",
          "#74aff3",
          "#dbcd9d",
          "#7bcaed",
          "#ebaba7",
          "#74d6e0",
          "#deb1e0",
          "#a1e9d1",
          "#adbce9",
          "#8dc4af",
        ],
      });

      dbColors.setColorScheme("Colorblind Friendly", {
        light: [
          "#37efab",
          "#58006c",
          "#b3e370",
          "#9a73ec",
          "#b1a200",
          "#0051ab",
          "#ff9e6a",
          "#601016",
          "#685d00",
          "#de3357",
        ],
        dark: [
          "#78a563",
          "#666fe8",
          "#c1b01b",
          "#014ca6",
          "#ffca5e",
          "#e2b1ff",
          "#008418",
          "#ff77bf",
          "#811e00",
          "#ff8c56",
        ],
      });
    },

    ChangePage(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
