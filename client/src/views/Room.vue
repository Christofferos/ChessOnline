<template>
  <div class="container">
    <section
      class="col-md-10 col-md-offset-1"
      style="display: flex; flex-direction: column; justify-content: center; align-items: center;"
    >
      <div class="row" style="text-align: center;">
        <h1 v-if="this.opponent === ''">Waiting for an opponent...</h1>
        <h1 v-else>{{ this.opponent }}</h1>
      </div>

      <div
        id="board"
        style="display: inline-block; vertical-align: bottom; <!-- text-align: center; -->"
      >
        <div
          class="row"
          v-for="row in rows"
          :key="row"
          v-bind:id="reverseBoard ? 7 - row : row"
          v-bind:style="{ display: 'flex', flexDirection: 'row' }"
        >
          <span
            class="col"
            v-for="col in columns"
            :key="col"
            v-bind:id="reverseBoard ? 7 - col : col"
            v-bind:style="{
              background: (col + row) % 2 === 0 ? '#E2E5BE' : '#58793B',
              display: 'flex',
              justifyContent: 'space-between',
              height: '100px',
              width: '100px',
              cursor: 'pointer',
            }"
          >
            <img
              v-if="piecePlacement[row][col] !== ''"
              :src="pieces[piecePlacement[row][col]]"
              style="width: 100px; position: absolute;"
            />
            <span
              v-if="reverseBoard === false"
              v-bind:style="{
                opacity: col === 0 ? 1 : 0,
                color: row % 2 === 0 ? '#58793B' : '#E2E5BE',
                fontWeight: 800,
              }"
              >{{ row + 1 }}
            </span>

            <span
              v-if="reverseBoard"
              v-bind:style="{
                opacity: col === 0 ? 1 : 0,
                color: row % 2 === 0 ? '#58793B' : '#E2E5BE',
                fontWeight: 800,
              }"
              >{{ 8 - row }}</span
            >
            <span
              v-bind:style="{
                display: 'flex',
                alignItems: 'flex-end',
                color: col % 2 !== 0 ? '#58793B' : '#E2E5BE',
                fontWeight: 1000,
                paddingRight: '3px',
              }"
              v-if="reverseBoard === false && row === 7"
              >{{ letters[col] }}</span
            >
            <span
              v-bind:style="{
                display: 'flex',
                alignItems: 'flex-end',
                color: col % 2 !== 0 ? '#58793B' : '#E2E5BE',
                fontWeight: 1000,
                paddingRight: '3px',
              }"
              v-if="reverseBoard && row === 7"
              >{{ letters[7 - col] }}</span
            >
          </span>
        </div>
      </div>

      <div class="row" style="text-align: center;">
        <h1>{{ this.$store.state.cookie.username }}</h1>
      </div>

      <div
        style="text-align: center; padding: 20px; border-radius: 10px;
        background: #41403D; width: 450px; margin: auto auto 25px auto;"
      >
        <button v-clipboard="() => room" class="well btn btn-default button">
          🔗 Game Code
        </button>

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
import P from '../assets/wp.png';
import R from '../assets/wr.png';
import N from '../assets/wn.png';
import B from '../assets/wb.png';
import Q from '../assets/wq.png';
import K from '../assets/wk.png';
import p from '../assets/bp.png';
import r from '../assets/br.png';
import n from '../assets/bn.png';
import b from '../assets/bb.png';
import q from '../assets/bq.png';
import k from '../assets/bk.png';

export default {
  name: 'Room',
  components: {},
  data() {
    return {
      room: this.$route.params.roomName,
      game: null,
      entries: [],
      socket: null,
      input: '',
      opponent: '',
      reverseBoard: false,
      rows: [0, 1, 2, 3, 4, 5, 6, 7],
      columns: [0, 1, 2, 3, 4, 5, 6, 7],
      letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      pieces: {
        P,
        R,
        N,
        B,
        Q,
        K,
        p,
        r,
        n,
        b,
        q,
        k,
      },
      piecePlacement: [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
      ],
      emptyPiecePlacement: [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
      ],
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
    updatePiecePlacement() {
      console.log('update piece placement');
      if (this.game !== null) {
        let row = 0;
        let col = 0;
        this.piecePlacement = this.emptyPiecePlacement;
        let pieces = this.game.gameState.split(' ')[0];
        if (this.reverseBoard) {
          pieces = pieces
            .split('')
            .reverse()
            .join('');
        }
        console.log(pieces);
        for (let i = 0; i < pieces.length; i += 1) {
          if (pieces.charAt(i) === '/') {
            row += 1;
            col = 0;
          } else if (pieces.charAt(i).match('[rnbqkpRNBQKP]')) {
            this.piecePlacement[row][col] = pieces.charAt(i);
            col += 1;
          } else {
            col += Number(pieces.charAt(i));
          }
        }
        console.log(row + col);
        console.log(this.piecePlacement);
        console.log(this.game.gameState);
        console.log(pieces);
      }
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
      .then((data) => {
        this.game = data.game;
        if (data.game.player1 === this.$store.state.cookie.username) {
          this.opponent = data.game.player2;
        } else if (data.game.player2 === this.$store.state.cookie.username) {
          this.opponent = data.game.player1;
        }
        this.updatePiecePlacement();
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
