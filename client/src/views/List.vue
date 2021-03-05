<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div class="row" style="text-align: center; align-items: center; justify-content: center">
        <h1>Time Slots</h1>
      </div>

      <div
        class="row"
        v-for="timeSlot in timeSlots"
        :key="timeSlot.id"
        style="justify-content: center"
      >
        <div style="display: flex; justify-content: center">
          <div
            style="
              border: 1px solid black;
              border-radius: 3px;
              width: 250px;
              text-align: center;
              cursor: pointer;
            "
            class="row"
            v-on:click="selectTimeSlot(timeSlot)"
            v-bind:style="
              timeSlot.bookedBy === ''
                ? 'background-color: #54e827;' /* green */
                : timeSlot.bookedBy === 'Reserved!'
                ? 'background-color: yellow;' /* yellow */
                : 'background-color: #ed281a;' /* red */
            "
          >
            <span style="margin-left: 20px; font-size: 24px">Time: {{ timeSlot.time }}</span>
            <br />
            <span style="margin-left: 20px; font-size: 16px"
              >Assistant:
              <span v-if="timeSlot.assistantId < assistantNames.length">{{
                assistantNames[timeSlot.assistantId]
              }}</span>
              <span v-if="timeSlot.assistantId > assistantNames.length"> -</span>
            </span>
            <br />
            <span style="margin-left: 20px; font-size: 16px"
              >Booked by: {{ timeSlot.bookedBy }}</span
            >
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
    timeSlots: [],
    assistantNames: [],
    socket: null,
  }),
  created() {
    // Update
    this.socket = this.$root.socket;
    this.socket.on('timeSlotAdded', (newTimeSlot) => {
      console.log('Update all clients with newly added timeSlot', newTimeSlot);
      console.log('this.timeSlots: ', this.timeSlots);
      this.timeSlots = [...Object.values(this.timeSlots), newTimeSlot];
    });
    this.socket.on('remainingTimeSlots', (remainingTimeSlots) => {
      console.log('Remaining timeSlots for all clients', remainingTimeSlots);
      this.timeSlots = Object.values(remainingTimeSlots);
    });
    /* Update statuses */
    this.socket.on('timeSlotTaken', (timeSlotTaken) => {
      console.log('TimeSlotTaken: ', timeSlotTaken);
      if (
        this.timeSlots[timeSlotTaken.id] !== undefined
        && this.timeSlots[timeSlotTaken.id] !== null
      ) {
        this.timeSlots[timeSlotTaken.id].bookedBy = timeSlotTaken.bookedBy;
      }
    });
    this.socket.on('timeSlotReserved', (timeSlotReserved) => {
      console.log('TimeSlotReserved: ', timeSlotReserved);
      if (
        this.timeSlots[timeSlotReserved.id] !== undefined
        && this.timeSlots[timeSlotReserved.id] !== null
      ) {
        this.timeSlots[timeSlotReserved.id].bookedBy = 'Reserved!';
      }
    });
    this.socket.on('cancelReservedTime', (timeSlotCancel) => {
      console.log('cancelReservedTime: ', timeSlotCancel);
      if (
        this.timeSlots[timeSlotCancel.id] !== undefined
        && this.timeSlots[timeSlotCancel.id] !== null
      ) {
        this.timeSlots[timeSlotCancel.id].bookedBy = '';
      }
    });

    // TimeSlots
    fetch('/api/timeSlots', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json(); // Return json
        }
        console.log('something went wrong');
        throw new Error(resp.text);
      })
      .then((data) => {
        this.timeSlots = [];
        data.list.map(timeSlot => this.timeSlots.push(timeSlot));
        /* console.log(this.timeSlots); */
      })
      .catch((error) => {
        console.error('Something went wrong');
        throw error;
      });

    // Assistants
    fetch('/api/assistants', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json(); // Return json
        }
        console.log('something went wrong');
        throw new Error(resp.text);
      })
      .then((data) => {
        this.assistantNames = [];
        console.log('reached');
        data.list.map(assistant => this.assistantNames.push(assistant.name));
        console.log('assistantNames: ', this.assistantNames);
      })
      .catch((error) => {
        console.error('Something went wrong');
        throw error;
      });
  },
  methods: {
    redirect(timeSlot) {
      this.$router.push(`${timeSlot}`);
    },
    selectTimeSlot(timeSlot) {
      console.log('timeSlot: ', timeSlot);
      fetch('/api/checkTimeSlotStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeSlotId: timeSlot.id }),
      })
        .then(resp => resp.json())
        .then((data) => {
          if (data.status === 'free') {
            const address = `/bookTimeSlot/${timeSlot.id}`;
            this.redirect(address);
          } else if (data.status === 'taken') {
            this.redirect('/timeSlotTaken');
          } else if (data.status === 'reserved') {
            this.redirect('/timeSlotReserved');
          }
        });
    },
  },
};
</script>
