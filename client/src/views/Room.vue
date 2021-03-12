<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div class="row" style="text-align: center;">
        <h1 v-if="this.opponent === ''">Waiting for an opponent...</h1>
        <h1 v-else>{{ this.opponent }}</h1>
      </div>

      <div class="board" style="text-align: center;"></div>

      <div class="row" style="text-align: center;">
        <img src="https://miro.medium.com/max/1306/1*1VS0ChJwwd0vx1URrH-zOQ.png" />
      </div>
      <div class="row" style="text-align: center;">
        <h1>{{ this.$store.state.cookie.username }}</h1>
      </div>

      <div
        style="text-align: center; padding: 20px; border-radius: 10px;
        background: #41403D; width: 450px; margin: auto auto 25px auto;"
      >
        <div id="clipboard" style="display: none;">{{ this.room }}</div>
        <input
          class="well btn btn-default button"
          type="button"
          value="🔗 Game Code"
          v-on:click="copyToClipboard()"
        />
        <!--  -->
        <h1>Chat</h1>
        <form v-on:submit.prevent="send()">
          <input
            v-model="input"
            class="form-control"
            type="text"
            style="margin: 10px auto; font-size: 15px;"
            required
            autofocus
            placeholder="Write to your opponent.."
          />
        </form>
        <div
          style="border: 2px solid black; width: 350px; margin: auto auto 25px auto;
           background: #504F4C; border-radius: 5px;"
        >
          <div
            v-for="(entry, index) in entries.slice(0, 10)"
            :key="index"
            style="color: white; text-align: justify; padding: 3px"
          >
            {{ entry }}
            <br />
          </div>
        </div>
      </div>
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
      opponent: '',
      reverseBoard: false,
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
    fetch(`/api/room/${this.room}/join`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Unexpected failure when joining room: ${this.room}`);
        }
        return resp.json();
      })
      .catch(console.error);

    this.socket = this.$root.socket;
    this.socket.on('msg', (msg) => {
      this.entries = [msg, ...this.entries];
    });

    this.socket.on('getGamePlayers', (players) => {
      console.log('Player1 & Player2: ', players.player1, players.player2);
      console.log('Store username: ', this.$store.state.cookie.username);
      if (this.$store.state.cookie.username !== players.player1) {
        this.opponent = players.player1;
        this.reverseBoard = true;
      } else if (this.$store.state.cookie.username !== players.player2) {
        this.opponent = players.player2;
      }
    });
  },
  createBoard() {
    let boardElement = document.getElementById('board');
    let rows = '';
    for (let y = 0; y < 8; y += 1) {
      rows += `<div class="row" id=${x}>`;
      for (let x = 0; x < 8; x += 1) {
        const cell = document.createElement('div');
        cell.className = 'col';
        cell.id = x + y * 8;
        if (cell.id % 2 === 0) {
          cell.style.background = '#E2E5BE'; // Vit
        } else {
          cell.style.background = '#58793B'; // Green
        }
        // #BFD01A // Gul - Flytta
        boardElement.appendChild(cell);
      }
      rows += '</div>';
    }
  },
  copyToClipboard() {
    const copyText = document.getElementById('clipboard');
    console.log('Copy to clipboard');
  },
  beforeDestroy() {
    if (this.opponent === '') {
      fetch('/api/removeGame', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.room,
        }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`Unexpected failure when joining room: ${this.room}`);
          }
          return resp;
        })
        .catch(console.error);
    }
  },
};
</script>

<style>
h1,
h2 {
  color: white;
}

.button {
  background: #353432;
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.2;
  color: #c1c0c0;
  width: 350px;
  border: none;
}
.button:hover {
  background: #32322f;
  color: white;
}
</style>
