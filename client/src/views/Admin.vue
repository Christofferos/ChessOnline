<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Admin: {{ this.currentlyLoggedIn }}</h1>
    <div style="display: flex; justify-content: center;">
      <form v-on:submit.prevent="addTimeSlot()" style="display: flex; justify-content: center;">
        <input
          type="time"
          id="appt"
          name="appt"
          min="00:00"
          max="23:59"
          required
          style="display:block"
          v-model="time"
        />
        <button id="addTimeSlotBtn" type="submit" style="display:block">
          Add Time Slot
        </button>
      </form>
    </div>
    <div
      v-for="timeSlot in timeSlots"
      :key="timeSlot.id"
      style="display:flex; justify-content: center;"
    >
      <div
        style="border: 1px solid black; border-radius: 3px; width: 250px"
        v-bind:style="
          timeSlot.bookedBy === '' ? 'background-color: white;' : 'background-color: red;'
        "
      >
        <input type="checkbox" v-on:click="selectTimeSlot(timeSlot.id)" />
        <span style="margin-left: 20px; font-size: 24px;">Time: {{ timeSlot.time }}</span>
        <br />
        <span style="margin-left: 20px; font-size: 16px;"
          >Assistant:
          <span v-if="timeSlot.assistantId < assistantNames.length">{{
            assistantNames[timeSlot.assistantId]
          }}</span>
          <span v-if="timeSlot.assistantId > assistantNames.length"> -</span>
        </span>
        <br />
        <span style="margin-left: 20px; font-size: 16px;">Booked by: {{ timeSlot.bookedBy }}</span>
      </div>
    </div>
    <div id="statusFail" v-if="success === false" class="badge red">Removal failed</div>
    <div style="display: flex; justify-content: center;">
      <form v-on:submit.prevent="removeTimeSlots()">
        <div style="display: flex; justify-content: center;" id="assistantTimeSlots"></div>
        <button
          id="removeTimeSlotBtn"
          type="submit"
          style="display: flex; justify-content: center; margin-top:20px;"
        >
          Remove Time Slot
        </button>
      </form>
    </div>
    <br />
    <input type="button" v-on:click="signOut()" value="Sign out" style="width: 50%" />
  </div>
</template>

<script>
export default {
  name: 'Admin',
  components: {},
  data() {
    return {
      time: '',
      timeSlots: [],
      timeSlotsToRemove: [],
      assistantNames: [],
      currentlyLoggedIn: '',
      success: true,
      socket: null,
    };
  },
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
    this.socket.on('timeSlotTaken', (timeSlotTaken) => {
      console.log('TimeSlotTaken: ', timeSlotTaken);
      if (
        this.timeSlots[timeSlotTaken.id] !== undefined
        && this.timeSlots[timeSlotTaken.id] !== null
      ) {
        this.timeSlots[timeSlotTaken.id].bookedBy = timeSlotTaken.bookedBy;
      }
    });

    this.currentlyLoggedIn = this.$store.state.cookie.username;

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
        data.list.map(assistant => this.assistantNames.push(assistant.name));
      })
      .catch((error) => {
        console.error('Something went wrong');
        throw error;
      });
  },
  methods: {
    selectTimeSlot(timeSlotId) {
      /* console.log('checked', timeSlotId); */
      this.timeSlotsToRemove.push(timeSlotId);
    },
    removeTimeSlots() {
      console.log('remove time slot/s');
      fetch('/api/removeTimeSlots', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeSlotsToRemove: this.timeSlotsToRemove }),
      })
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          throw new Error(resp.text);
        })
        .then((data) => {
          this.success = data.success;
          this.timeSlots = data.remainingTimeSlots;
        })
        .catch((error) => {
          console.error('Error');
          throw error;
        });
    },
    addTimeSlot() {
      console.log(this.time);
      fetch('/api/addTimeSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time: this.time }),
      })
        .then((resp) => {
          if (resp.ok) {
            if (!this.timeSlots) this.timeSlots = [];
            else this.timeSlots = Object.values(this.timeSlots);
            return resp.json();
          }
          throw new Error(resp.text);
        })
        .catch((error) => {
          console.error('Add time slot failed unexpectedly');
          throw error;
        });
    },
    signOut() {
      this.$store.state.isAuthenticated = false;
      fetch('/api/removeSession', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          console.log('something went wrong');
          throw new Error(resp.text);
        })
        .then((data) => {
          if (data.success) {
            this.redirect('/login?statusSuccess=Signed out successfully');
          }
        })
        .catch((error) => {
          console.error('Something went wrong');
          throw error;
        });
    },
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>
