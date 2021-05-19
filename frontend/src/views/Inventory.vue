<template>
  <div>
    <h1>Inventory</h1>
    <input v-model="start">
    <p>Start</p>

    <input v-model="end">
    <p>End</p>

    <input v-model="capacity">
    <p>Capacity</p>


    <button v-on:click="create">Create</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  
  name: 'Inventory',
  data() {
    return {
      start: '',
      end: '',
      capacity: 0
    }
  },
  methods: {
    create: async function () {
      try {
        await axios({
          method: 'post',
          url: 'http://localhost:9090/inventory',
          headers: {}, 
          data: {
            start: this.start,
            end: this.end,
            capacity: this.capacity
          }
        });
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
