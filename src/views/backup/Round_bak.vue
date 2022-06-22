<template>
  <q-page class="ub-page" v-if="loaded">
    <div class="row items-center">
      <div class="col-md-12 q-ma-sm">
        <div class="text-h6">Rounds</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-4" style="padding: 5px">
        <q-card flat bordered class="my-card">
          <q-card-section class="text-center">
            <div class="text-subtitle2">TODO</div>
          </q-card-section>
          <q-card-section>
            <q-scroll-area style="height: 350px">
              <round-card
                v-for="todo_task in todo"
                :key="todo_task.id"
                :task="todo_task"
              ></round-card>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4" style="padding: 5px">
        <q-card flat bordered class="my-card" style="">
          <q-card-section class="text-center">
            <div class="text-subtitle2">IN PROGRESS</div>
          </q-card-section>
          <q-card-section>
            <q-scroll-area style="height: 350px">
              <round-card
                v-for="inprogress_task in inprogress"
                :key="inprogress_task.id"
                :task="inprogress_task"
              ></round-card>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4" style="padding: 5px">
        <q-card flat bordered class="my-card" style="">
          <q-card-section class="text-center">
            <div class="text-subtitle2">DONE</div>
          </q-card-section>
          <q-card-section>
            <q-scroll-area style="height: 350px">
              <round-card
                v-for="done_task in done"
                :key="done_task.id"
                :task="done_task"
              ></round-card>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import RoundCard from "@/components/RoundCard.vue";
import tracking_service from "@/services/TrackingService.js";

export default {
  name: "Round",
  components: {
    RoundCard,
  },
  data() {
    return {
      loaded: false,
      todo: [],
      inprogress: [],
      done: [],
      overdue: [],
      detail_round: [],
    };
  },
  mounted() {},
  created() {
    this.getRoundList();
  },
  methods: {
    getRoundList() {
      tracking_service.GetRoundList().then((data) => {
        if (data != null) {
          this.inprogress = data;
          this.loaded = true;
        }
      });
    },
  },
};
</script>
