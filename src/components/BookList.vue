<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Variables
const bookList = ref([])
const error = ref(false)
const router = useRouter()

// Functions
const navigateToBook = (id: number) => {
  router.push({ name: 'book-details', params: { id: id } })
}

// Hooks
onMounted(async () => {
  error.value = false

  await axios
    .get('http://localhost:8000/books')
    .then((response) => (bookList.value = response.data.books))
    .catch((error) => {
      error.value = true
      console.error(error)
    })
})
</script>

<template>
  <v-row
    ><v-col cols="12" md="4" v-for="book in bookList" :key="book.id">
      <v-card @click="navigateToBook(book.id)">
        <v-card-item>
          <v-card-title>{{ book.title }}</v-card-title>
          <v-card-subtitle>{{ book.author }}</v-card-subtitle>
        </v-card-item>
        <v-card-text> </v-card-text> </v-card></v-col
  ></v-row>
</template>
