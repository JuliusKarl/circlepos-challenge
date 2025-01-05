<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// UI Components
import { Card, Button, Skeleton, Dropdown } from 'primevue'

// Variables
const isLoading = ref(true)
const bookList = ref([])
const router = useRouter()
const sortOptions = [{ sort: 'Title' }, { sort: 'Author' }, { sort: 'Price' }]

// Functions
const navigateToBook = (id: number) => {
  router.push({ name: 'book-details', params: { id: id } })
}

// Hooks
onMounted(async () => {
  await axios
    .get(import.meta.env.VITE_API_URL + '/books')
    .then((response) => {
      bookList.value = response.data.books
      isLoading.value = false
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<template>
  <div class="flex justify-content-between">
    <h1 class="inline-block">All Books</h1>
    <div class="align-content-center">
      <Dropdown
        :options="sortOptions"
        optionLabel="sort"
        placeholder="Sort by"
        class="w-full md:w-8rem"
      />
    </div>
  </div>
  <div class="grid" v-show="!isLoading">
    <div class="p-2 col-12 lg:col-3 inline-block" v-for="book in bookList" :key="book.id">
      <Card>
        <template #title>{{ book.title }}</template>
        <template #subtitle>{{ book.author }}</template>

        <template #footer>
          <div class="flex gap-4 mt-1">
            <Button label="View Details" class="w-1/2" @click="navigateToBook(book.id)" />
          </div>
        </template>
      </Card>
    </div>

    <div v-show="isLoading">
      <div class="p-2 col-12 lg:col-3 inline-block" v-for="index in 20" :key="index">
        <div
          class="border-round-2xl p-3 flex flex-column justify-content-between skeleton-container"
        >
          <Skeleton class="mb-2 h-2rem"></Skeleton>
          <Skeleton class="mb-2 w-6 h-1rem"></Skeleton>
          <Skeleton class="h-2rem"></Skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  background-color: #18181b;
}
</style>
