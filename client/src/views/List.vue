<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div class="row" style="text-align: center;">
        <h1>Queues</h1>
      </div>

      <div class="row">
        <div class="well" v-for="room in rooms" @click="redirect(room.name)" :key="room.name">
          <div class="row" style="text-align: center;">
            <h4>
              <span>{{ room.name }}</span>
            </h4>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'List',
  components: {},
  data: () => ({
    rooms: [],
  }),
  methods: {
    redirect(roomName) {
      this.$router.push(`/room/${roomName}`);
    },
  },
  created() {
    fetch('/api/roomList')
      .then(res => res.json())
      .then((data) => {
        this.rooms = data.list;
      })
      .catch(console.error);
  },
};
</script>
