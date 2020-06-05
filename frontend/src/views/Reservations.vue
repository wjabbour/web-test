<template>
  <div>
    <h1>Reservations</h1>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Reservations',

  async mounted() {
    try {
      await axios.get('http://localhost:9090/test')
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
