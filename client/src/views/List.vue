<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div class="row" style="text-align: center;">
        <h1 style="color: white">Play Chess</h1>
      </div>

      <div class="row">
        <div class="row" style="text-align: center;">
          <input
            class="well btn btn-default button"
            v-on:click="newGame()"
            type="button"
            value="Create Game"
          />
        </div>
        <h3 style="text-align: center; color: white">OR</h3>

        <form v-on:submit.prevent="join()">
          <div class="row" style="text-align: center;">
            <input
              class="well"
              type="text"
              placeholder="Enter Game Code"
              style="width: 350px; font-size: 22px; text-align: center; border-radius: 5px;"
              pattern="[A-Za-z1-9]{8}"
              title="Eight letter code"
              v-model="gameCode"
            />
          </div>

          <div class="row" style="text-align: center;">
            <input class="well btn btn-default button" type="submit" value="Join Game" />
          </div>
        </form>

        <div class="row" style="text-align: center; margin-top: 10px;">
          <h3 style="color: white">Players Online: 0</h3>

          <div class="row" style="text-align: center; ">
            <input class="well btn btn-default button" type="button" value="Find Opponent" />
          </div>
        </div>

        <div class="row" style="text-align: center; margin-top: 10px;">
          <h3 style="color: white">Active Games:</h3>
        </div>
        <div
          class="row well button"
          v-for="room in rooms"
          @click="redirect(room.id)"
          :key="room.id"
          style="margin: auto auto 5px auto"
        >
          <div class="row" style="text-align: center;">
            <h4>
              <span>{{ room.id }}</span>
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
    gameCode: '',
  }),
  created() {
    this.$root.socket.on('newRoom', (newRoom) => {
      console.log('Update all clients with newly added room', newRoom);
      this.rooms = [...Object.values(this.rooms), newRoom];
    });
    this.$root.socket.on('remainingRooms', (remainingRooms) => {
      console.log('Update all clients with remaining rooms', remainingRooms);
      this.rooms = Object.values(remainingRooms);
    });

    fetch('/api/userRoomList')
      .then(res => res.json())
      .then((data) => {
        this.rooms = data.list;
      })
      .catch(console.error);
  },
  methods: {
    redirect(roomName) {
      this.$router.push(`/room/${roomName}`);
    },
    newGame() {
      fetch('/api/newGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
        }),
      })
        .then((resp) => {
          if (resp.ok) return resp.json();
          throw new Error(resp.text);
        })
        .then((data) => {
          this.redirect(data.gameId);
        })
        .catch((error) => {
          console.error('Create game failed.');
          throw error;
        });
    },
    join() {
      fetch(`/api/room/${this.gameCode}/join`)
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`Unexpected failure when joining room: ${this.gameCode}`);
          }
          return resp.json();
        })
        .then((data) => {
          if (data.success) {
            this.redirect(this.gameCode);
          }
        })
        .catch(console.error);

      console.log('gameCode: ', this.gameCode);
    },
  },
};
</script>

<style>
.button {
  background: #7fa650;
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.2;
  color: white;
  width: 350px;
  border: none;
}
.button:hover {
  background: #95bb4a;
  color: white;
}
</style>
