<template>
  <div>
    <q-card v-ripple flat bordered class="my-card bg-grey-1 q-hoverable">
      <q-card-section>{{ round.display_name }} </q-card-section>
      <q-card-actions align="center">
        <q-btn
          color="primary"
          size="xs"
          label="Tracking"
          @click="TrackingRound(round.id)"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { PATH_LIST_URL } from "@/data/URL.js";

export default {
  name: "RoundCard",
  props: ["round"],
  data() {
    return {};
  },
  methods: {
    TrackingRound(round_id) {
      this.$router.push(
        PATH_LIST_URL.replace(":round_id", round_id).replace("/api", "")
      );
    }
  }
};
</script>
