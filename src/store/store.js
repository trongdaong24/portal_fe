import Vue from "vue";
import Vuex from "vuex";
import layout from "./modules/layout";
import authen from "./modules/authen";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    layout,
    authen,
    tagsView,
    permission
  },
  mutations: {},
  actions: {}
});
