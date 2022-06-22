<template>
  <q-breadcrumbs align="left" gutter="sm" v-if="levelList != null">
    <q-breadcrumbs-el label=""></q-breadcrumbs-el>
    <q-breadcrumbs-el
      :label="l"
      v-for="l in levelList"
      :key="l"
    ></q-breadcrumbs-el>
  </q-breadcrumbs>
</template>

<script>
import { QBreadcrumbs, QBreadcrumbsEl } from "quasar";
export default {
  name: "breadcrumb",
  components: {
    QBreadcrumbs,
    QBreadcrumbsEl
  },
  data() {
    return {
      levelList: null
    };
  },

  watch: {
    $route(route) {
      this.getBreadcrumb();
    }
  },

  created() {
    this.getBreadcrumb();
  },

  methods: {
    getBreadcrumb() {
      this.levelList = this.$route.path.split("/").map(el => el.toUpperCase());
      console.log(this.levelList);
    }
  }
};
</script>
