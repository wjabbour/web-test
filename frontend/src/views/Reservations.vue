<template>
  <div>
    <h1>Athena Grill</h1>

    <select v-model="guests">
      <option disabled value="">Please select</option>
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
    </select>
    <p>Guest(s)</p>

    <input type="date" v-model="myDate" v-on:change="findSlots"/>
    <p>Date</p>

    <input v-model="email">
    <p>Email</p>

    <input v-model="name">
    <p>Name</p>

    <select v-model="time">
      <option disabled value="">Please Select</option>
      <option v-for="slot in slots" :key='slot'>{{ slot }}</option>
    </select>
    <p>Time Slot</p>

    <button v-on:click="placeReservation">Place Reservation</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Reservations',
  data() {
    return {
      name: '',
      email: '',
      myDate: '',
      slots: [],
      guests: 0,
      time: ''
    }
  },
  methods: {
    placeReservation: async function () {
      try {
        await axios({
          method: 'post',
          url: 'http://localhost:9090/reservation',
          data: {
            name: this.name,
            email: this.email,
            date: this.myDate,
            time: this.time,
            size: this.size
          }
        });
      } catch (error) {
        console.error(error)
      }
    },
    findSlots: async function () {
      try {
        const slots = await axios({
          method: 'get',
          url: 'http://localhost:9090/slots',
          params: {
            date: this.myDate
          }
        });
        this.slots = slots.data;
    } catch (error) {
      console.error(error)
    }
    }
  }
}
</script>
<style scoped>
  p {
    margin-top: 10px;
    margin-bottom: 26px;
  }
</style>
