<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div class="row" style="text-align: center;">
        <h1>{{ room }}</h1>
      </div>
      <div style="border: 2px solid black">
        <div v-for="(entry,index) in entries" :key="index">
          {{ entry }}
          <br />
        </div>
      </div>
      <form v-on:submit.prevent="send()">
        <input v-model="input" class="form-control" type="text" required autofocus />
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Room',
  components: {},
  data() {
    return {
      room: this.$route.params.roomName,
      entries: [],
      socket: null,
      input: '',
    };
  },
  methods: {
    send() {
      fetch(`/api/room/${this.room}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: this.input,
        }),
      }).catch(console.error);
      this.input = '';
    },
  },
  created() {
    this.socket = this.$root.socket;
    this.socket.on('msg', (msg) => {
      this.entries = [...this.entries, msg];
    });

    fetch(`/api/room/${this.room}/join`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Unexpected failure when joining room: ${this.room}`);
        }
        return resp.json();
      })
      .catch(console.error)
      .then((data) => {
        this.entries = data.list;
      });
  },
};
</script>
