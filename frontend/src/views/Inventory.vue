<template>
  <div>
    <h1>Inventory</h1>
    <input v-model="start">
    <p>Start Time</p>

    <input v-model="end">
    <p>End Time</p>

    <input v-model="capacity">
    <p>Capacity</p>
    <button v-on:click="create">Create</button>
  
    <div class="available-inventory-container">
      <p>Available Inventory</p>
      <input type="date" v-model="myDate" v-on:change="getInventory"/>
      <li v-for="i in inventory" :key='i.start + i.end + i.capacity' >
        {{ i.start }} - {{ i.end }}
        <div v-for="c in i.reserveCapacities" :key="c.time">
          {{ c.time }} - {{ c.reserveCapacity }} parties
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
        await this.getInventory()
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
            date: this.myDate || new Date().toString(),
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
<style scoped lang="scss">

  p {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  li {
    padding-top: 10px;
  }

  .available-inventory-container {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid lightgrey;
  }
</style>