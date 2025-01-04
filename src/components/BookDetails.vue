<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// Variables
const loading = ref(true)
const book = ref()
const error = ref(false)
const route = useRoute()

// Hooks
onMounted(async () => {
  error.value = false

  await axios
    .get(import.meta.env.VITE_API_URL + '/books/' + route.params.id)
    .then((response) => {
      book.value = response.data.book
      loading.value = false
    })
    .catch((error) => {
      console.error(error)
      error.value = true
      loading.value = false
    })
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card class="card">
        <div class="loading-container">
          <v-progress-circular
            model-value="30"
            indeterminate
            v-show="loading"
            class="loading-spinner"
          ></v-progress-circular>
        </div>

        <div v-show="!loading">
          <v-card-item>
            <v-card-title>{{ book?.title }}</v-card-title>
            <v-card-subtitle>{{ book?.author }}</v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn>Buy Now</v-btn>
          </v-card-actions>
        </div>
      </v-card></v-col
    ></v-row
  >
</template>

<style scoped>
.card {
  min-height: 150px;
  align-content: center;
}

.loading-container {
  width: 100%;
  text-align: center;
}
</style>
