<template>
  <div class="q-pa-md" style="max-width: 280px">
    <q-list style="width: 260px">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="images/avatars/male/1.png" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            <div class="text-h5">{{ username }}</div>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item clickable v-ripple v-close-popup>
        <q-item-section avatar>
          <q-icon name="mdi-logout"></q-icon>
        </q-item-section>
        <q-item-section @click="logout">
          <q-item-label lines="1">
            Log Out
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { AUTH_LOGOUT } from '../../store/actions/auth';

export default {
  name: 'UserInfo',
  components: {},
  props: {},
  data() {
    return {
      username: ''
    };
  },
  computed: {},
  mounted() {
    if (localStorage.username) {
      this.username = localStorage.username;
    }
  },
  watch: {},
  methods: {
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/login');
      });
    }
  }
};
</script>
