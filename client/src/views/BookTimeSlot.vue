<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div
        style="
          text-align: center;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          display: flex;
        "
      >
        <h1 class="row" style="display: flex; justify-content: center; align-items: center">
          Confirm The Reservation ({{ this.timer }})
        </h1>
        <!-- <span v-if="timer<=0"></span> -->
        <br />
        <div v-if="timeSlot" style="display: flex; justify-content: center" class="row">
          <div style="border: 1px solid black; border-radius: 3px; width: 250px">
            <span style="margin-left: 20px; font-size: 16px">Time: {{ timeSlot.time }}</span>
            <br />
            <span style="margin-left: 20px; font-size: 16px">
              <span v-if="assistantName">Assistant: {{ assistantName }}</span>
            </span>
            <br />
            <br />
            <form>
              <input
                type="text"
                v-model="studentName"
                placeholder="Your name..."
                pattern="^[a-zA-Z]{3,24}$"
              />
              <p color="red">Enter at least 3 letters, but no more than 24.</p>
              <br />
              <input type="button" v-on:click="cancelBookedTime()" value="Cancel" />
              <input type="submit" v-on:click="confirmBookedTime()" value="Confirm" />
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'BookTimeSlot',
  components: {},
  data: () => ({
    timeSlot: {},
    assistantName: '',
    studentName: '',
    timer: 20,
    timerId: null,
  }),
  async created() {
    this.timerId = setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) {
        clearTimeout(this.timerId);
        this.timerId = null;
        this.timer = 20;

        console.log('65 TIMESLOT in bookeddtime: ', this.timeSlot);
        fetch('/api/cancelReservedTime', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentName: this.timeSlot.bookedBy,
            timeSlotId: this.timeSlot.id,
          }),
        })
          .then((resp) => {
            if (resp.ok) {
              return resp;
            }
            console.log('something went wrong');
            throw new Error(resp.text);
          })
          .catch((error) => {
            console.error('Something went wrong');
            throw error;
          });

        this.redirect('list');
      }
    }, 1000);
    console.log(this.$router.history.current.params.timeSlotId);

    // TimeSlot
    await fetch('/api/reserveTimeSlot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timeSlotId: this.$router.history.current.params.timeSlotId }),
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json(); // Return json
        }
        console.log('something went wrong');
        throw new Error(resp.text);
      })
      .then((data) => {
        this.timeSlot = data.timeSlot;
      })
      .catch((error) => {
        console.error('Something went wrong');
        throw error;
      });

    // Assistant
    await fetch('/api/assistantName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assistantId: this.timeSlot.assistantId }),
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json(); // Return json
        }
        console.log('something went wrong');
        throw new Error(resp.text);
      })
      .then((data) => {
        this.assistantName = data.assistantName;
      })
      .catch((error) => {
        console.error('Something went wrong');
        throw error;
      });
  },
  methods: {
    redirect(address) {
      this.$router.push(`/${address}`);
    },
    cancelBookedTime() {
      console.log('TIMESLOT in bookeddtime: ', this.timeSlot);
      fetch('/api/cancelReservedTime', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeSlotId: this.timeSlot.id,
        }),
      })
        .then((resp) => {
          if (resp.ok) {
            return resp;
          }
          console.log('something went wrong');
          throw new Error(resp.text);
        })
        .catch((error) => {
          console.error('Something went wrong');
          throw error;
        });

      if (this.timerId !== null) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      this.redirect('list');
    },
    confirmBookedTime() {
      const regex = /^[a-zA-Z]{3,24}$/;
      if (regex.test(this.studentName)) {
        this.timeSlot.bookedBy = this.studentName;
        if (this.timerId !== null) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
        fetch('/api/confirmBookedTime', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentName: this.timeSlot.bookedBy,
            timeSlotId: this.timeSlot.id,
          }),
        })
          .then((resp) => {
            if (resp.ok) {
              return resp;
            }
            console.log('something went wrong');
            throw new Error(resp.text);
          })
          .catch((error) => {
            console.error('Something went wrong');
            throw error;
          });

        this.redirect('list');
      }
    },
  },
};
</script>
