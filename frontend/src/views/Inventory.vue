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

    <div>
      <input type="date" v-model="myDate" v-on:change="getInventory"/>
      <p>Available Inventory</p>
      <li v-for="i in inventory" :key='i.start + i.end + i.capacity' >
        {{ i.start }}
        {{ i.end }}
        {{ i.capacity }}
        <div v-for="c in i.reserveCapacities" :key="c.time">
          {{ c.time }}
          {{ c.reserveCapacity }}
        </div>
      </li>
    </div>
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
      capacity: 0,
      inventory: [],
      myDate: ''
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
    },
    getInventory: async function () {
      try {
        const res = await axios({
          method: 'get',
          url: 'http://localhost:9090/inventory',
          params: {
            date: this.myDate,
          }
        });
      
        this.inventory = res.data;
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
