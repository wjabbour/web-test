<template>
  <div>
    <h1>Inventory</h1>
    <input v-model="five">
    <p>5:00pm-6:00pm</p>

    <input v-model="six">
    <p>6:00pm-7:00pm</p>

    <input v-model="seven">
    <p>7:00pm-8:00pm</p>

    <input v-model="eight">
    <p>8:00pm-9:00pm</p>

    <input v-model="nine">
    <p>9:00pm-10:00pm</p>

    <button v-on:click="update">Update</button>
  </div>
</template>

<script>

export default {
  name: 'Inventory',
  data() {
    return {
      five: 0,
      six: 0,
      seven: 0,
      eight: 0,
      nine: 0
    }
  },
  methods: {
    update: function () {
      console.log('updated');
    }
  }
}
</script>
