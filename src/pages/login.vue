<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="ub-login-card">
          <q-card-section class="ub-login-hdr text-white text-center">
            <q-img
              src="logo-dark.png"
              style="height: 128px; width: 128px;"
            ></q-img>
            <div class="text-h5 absolute-bottom" style="margin-bottom: 20px;">
              Tracking NightWolf
            </div>
          </q-card-section>

          <q-card-section>
            <p style="color:red">{{ error }}</p>
            <q-card-section>
              <q-input v-model="username" clearable label="Username">
                <template v-slot:prepend>
                  <q-icon name="mdi-account" />
                </template>
              </q-input>
              <q-input
                v-model="password"
                type="password"
                clearable
                label="password"
              >
                <template v-slot:prepend>
                  <q-icon name="mdi-lock" />
                </template>
              </q-input>
            </q-card-section>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn color="primary" unelevated @click="login">Login</q-btn>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { AUTH_REQUEST } from "../store/actions/auth";
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      error: state => state.authen.status
    }),
    dark: {
      get() {
        return this.$store.state.layout.dark;
      }
    }
  },
  mounted() {
    this.$q.dark.set(this.dark);
  },
  methods: {
    login: function() {
      const { username, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
        this.$router.push(this.$route.query.redirect || "/");
      });
    }
  }
};
</script>

<style lang="scss">
.ub-login-card {
  width: 100%;
  max-width: 400px;
  .ub-login-hdr {
    height: 200px;
    background: #0f2027; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #2c5364,
      #203a43,
      #0f2027
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #2c5364,
      #203a43,
      #0f2027
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
}
</style>
