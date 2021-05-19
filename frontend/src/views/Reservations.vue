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
    <span> guest(s)</span>

    <input type="date" v-model="myDate" v-on:change="findSlots"/>

    <select v-model="selected">
      <option disabled value="">Please select</option>
      <option>5:00</option>
      <option>5:15</option>
      <option>5:30</option>
      <option>5:45</option>
      <option>6:00</option>
    </select>
    <span> Time Slot </span>
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
      selected: '',
      myDate: '',
      guests: 0
    }
  },
  methods: {
    findSlots: async function () {
      try {
      await axios({
        method: 'get',
        url: 'http://localhost:9090/slots',
        params: {
          date: this.myDate
        }
      });
    } catch (error) {
      console.error(error)
    }
    }
  },
  async mounted() {
    try {
      await axios({
        method: 'post',
        url: 'http://localhost:9090/reservation',
        headers: {}, 
        data: {
          name: "Turner",
          email: "doubleujabbour@gmail.com",
          date: "05/19/2021",
          time: '5:15',
          size: 2
        }
      });
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
