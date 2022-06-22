import Vue from "vue";
import Router from "vue-router";
import MainLayout from "./layouts/mainlayout.vue";
import Round from "./views/Round.vue";
import PathList from "./views/PathList.vue";
import Login from "./pages/login.vue";
import NotFound from "./pages/NotFound.vue";
import store from "./store/store";
import TestCaseManager from "./views/TestCaseManager.vue";
import Statistic from "./views/Statistic.vue";
import PathDetail from "./views/PathDetail.vue";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }

  next("/login?redirect=" + to.path);
};

const isManager = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    if (store.getters.permission === "manager") {
      next();
      return;
    } else {
      next("/");
    }
  }
  next("/login");
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "Round",
          component: Round,
          //meta: { title: "Round", affix: false, noCache: true },
          // beforeEnter: ifAuthenticated
        },
        {
          path: "/tracking/round/:round_id/path",
          name: "PathList",
          component: PathList,
          props: true,
          //meta: { title: "PathList", affix: false, noCache: true },
          // beforeEnter: ifAuthenticated
        },
        {
          path: "/tracking/round/:round_id/path/:path_id",
          name: "PathDetail",
          component: PathDetail,
          props: true,
          //meta: { title: "PathDetail", affix: false, noCache: true },
        },
        {
          path: "/manager/testcase",
          name: "TestCaseManager",
          component: TestCaseManager,
          //  meta: { title: "TestCaseManager", affix: false, noCache: true },
          beforeEnter: isManager,
        },
        {
          path: "/manager/statistic",
          name: "Statistic",
          component: Statistic,
          beforeEnter: isManager,
        },
      ],
    },
    {
      name: "login",
      path: "/login",
      component: Login,
      // beforeEnter: ifNotAuthenticated
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound,
      beforeEnter: ifAuthenticated,
    },
  ],
});
