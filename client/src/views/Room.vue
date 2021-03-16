<template>
  <div class="container">
    <section
      class="col-md-10 col-md-offset-1"
      style="display: flex; flex-direction: column; justify-content: center; align-items: center;"
    >
      <div class="row" style="text-align: center;">
        <h1 v-if="this.opponent === ''">Waiting for an opponent...</h1>
        <h1 v-else>
          {{ this.black ? this.$store.state.cookie.username : this.opponent }}
        </h1>
      </div>

      <div
        id="board"
        style="display: inline-block; vertical-align: bottom; <!-- text-align: center; -->"
      >
        <div
          class="row"
          v-for="row in rows"
          :key="row"
          v-bind:id="row"
          v-bind:style="{ display: 'flex', flexDirection: 'row' }"
        >
          <span
            class="col"
            v-for="col in columns"
            :key="col"
            v-bind:id="col"
            v-on:click="() => checkSelectedPiece(row, col)"
            v-bind:style="{
              background:
                selectedPiece === row.toString() + col.toString()
                  ? 'yellow'
                  : (col + row) % 2 === 0
                  ? '#E2E5BE'
                  : '#58793B',

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
              v-bind:style="{
                opacity: col === 0 ? 1 : 0,
                color: row % 2 === 0 ? '#58793B' : '#E2E5BE',
                fontWeight: 800,
              }"
              >{{ 8 - row }}
            </span>
            <span
              v-if="row === 7"
              v-bind:style="{
                display: 'flex',
                alignItems: 'flex-end',
                color: col % 2 !== 0 ? '#58793B' : '#E2E5BE',
                fontWeight: 1000,
                paddingRight: '3px',
              }"
              >{{ letters[col] }}</span
            >
          </span>
        </div>
      </div>

      <div class="row" style="text-align: center;">
        <h1>
          {{ this.black ? this.opponent : this.$store.state.cookie.username }}
        </h1>
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
      black: false,
      selectedPiece: '',
      rows: [0, 1, 2, 3, 4, 5, 6, 7],
      columns: [0, 1, 2, 3, 4, 5, 6, 7],
      letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      setIntervalObj: null,
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
        /* // Timer
        if (this.opponent) {
          if (this.setIntervalObj !== null) clearInterval(this.setIntervalObj);
          this.setIntervalObj = setInterval(() => {
            if (this.game.fen.split(' ')[1] === 'w') {
              this.game.timeLeft1 -= 1;
            } else if (this.game.fen.split(' ')[1] === 'b') {
              this.game.timeLeft2 -= 1;
            }
            this.socket.emit(
              'updateTimers',
              this.game.id,
              this.game.timeLeft1,
              this.game.timeLeft2,
            );
          }, 1000);
        } */

        let row = 0;
        let col = 0;
        this.piecePlacement = [
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
        ];
        const pieces = this.game.fen.split(' ')[0];
        console.log('PIECES: ', pieces);
        for (let i = 0; i < pieces.length; i += 1) {
          if (pieces.charAt(i) === '/') {
            row += 1;
            col = 0;
          } else if (pieces.charAt(i).match('[rnbqkpRNBQKP]')) {
            this.piecePlacement[row][col] = pieces.charAt(i);
            col += 1;
          } else {
            for (let j = 0; j < Number(pieces.charAt(i)); j += 1) {
              this.piecePlacement[row][col + j] = '';
            }
            col += Number(pieces.charAt(i));
          }
        }
        console.log('row: ', row);
        console.log('column: ', col);
        console.log(this.piecePlacement);
        console.log(pieces);
      }
    },
    translateSelectedPiece(row, col) {
      const rank = 8 - Number(row);
      const file = this.letters[Number(col)];
      return file.toString() + rank.toString();
    },
    checkSelectedPiece(row, col) {
      console.log(row, col);
      console.log(this.piecePlacement);

      if (this.opponent !== '') {
        if (this.piecePlacement[row][col].match('[rnbqkp]') && this.black) {
          this.selectedPiece = row.toString() + col.toString();
        } else if (this.piecePlacement[row][col].match('[RNBQKP]') && this.black === false) {
          this.selectedPiece = row.toString() + col.toString();
        } else if (this.selectedPiece !== '') {
          this.socket.emit(
            'movePiece',
            this.game.id,
            this.translateSelectedPiece(
              this.selectedPiece.charAt(0),
              this.selectedPiece.charAt(1),
            ),
            this.translateSelectedPiece(row.toString(), col.toString()),
          );
        }
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
          this.black = true;
        }
        this.updatePiecePlacement();
        console.log('CREATED PIECE PLACEMENT: ', this.piecePlacement);
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
        this.black = true;
      } else if (this.$store.state.cookie.username !== players.player2) {
        this.opponent = players.player2;
      }
    });

    this.socket.on('movePieceResponse', (newFen, gameOver, draw1, draw2, draw3, draw4) => {
      if (gameOver) {
        if (draw1 || draw2 || draw3 || draw4) {
          console.log('DRAW!');
        } else if (newFen.split(' ')[1] === 'w' && this.black) {
          console.log('Check mate!');
          console.log('You win!');
        } else if (newFen.split(' ')[1] === 'w' && this.black === false) {
          console.log('Check mate!');
          console.log('You lose!');
        } else if (newFen.split(' ')[1] === 'b' && this.black) {
          console.log('Check mate!');
          console.log('You lose!');
        } else if (newFen.split(' ')[1] === 'b' && this.black === false) {
          console.log('Check mate!');
          console.log('You win!');
        }

        // TODO: Update matchHistory in db
      }
      this.selectedPiece = '';
      console.log('newFen ', newFen);
      this.game.fen = newFen;
      this.updatePiecePlacement();
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
