<script setup lang="ts">
// Imports
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// UI Components
import { Card, Button, Skeleton, Dropdown, InputText } from 'primevue'

// Variables
const isLoading = ref(true)
const allBooks = ref([])
const booksToRender = ref([])
const router = useRouter()
const search = ref('')
const sortType = ref('')
const sortOrder: 'ASC' | 'DESC' = ref('ASC')
const sortView: 'LIST' | 'GRID' = ref('LIST')
const sortOptions = [{ sort: 'Title' }, { sort: 'Author' }, { sort: 'Price' }]

// Functions
const navigateToBook = (id: number) => {
  router.push({ name: 'book-details', params: { id: id } })
}

const toggleSort = () => {
  booksToRender.value = allBooks.value.reverse()
  sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
}

const toggleView = () => {
  sortView.value = sortView.value === 'LIST' ? 'GRID' : 'LIST'
}

watch(sortType, () => {
  switch (sortType.value.sort) {
    case 'Title':
      booksToRender.value = booksToRender.value.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'Author':
      booksToRender.value = booksToRender.value.sort((a, b) => a.author.localeCompare(b.author))
      break
    case 'Price':
      booksToRender.value = booksToRender.value.sort((a, b) => a.price - b.price)
      break
  }
})

watch(search, () => {
  booksToRender.value = allBooks.value.filter((book) => {
    return book.title.toLowerCase().includes(search.value.toLowerCase())
  })
})

// Hooks
onMounted(async () => {
  await axios
    .get(import.meta.env.VITE_API_URL + '/books')
    .then((response) => {
      allBooks.value = response.data.books
      booksToRender.value = response.data.books
      isLoading.value = false
    })
    .catch((error) => {
      console.error(error)
      isLoading.value = false
    })
})
</script>

<template>
  <div class="grid">
    <h1 class="col-12 lg:col-4 inline-block">All Books</h1>
    <div class="col-12 lg:col-4 align-content-center">
      <InputText class="w-full" type="text" v-model="search" placeholder="Find a book..." />
    </div>
    <div class="col-12 lg:col-4 text-right align-content-center">
      <div>
        <Button variant="link" @click="toggleSort()"
          ><span class="pi pi-arrow-right-arrow-left rotate-90"
        /></Button>

        <Dropdown
          v-model="sortType"
          :options="sortOptions"
          optionLabel="sort"
          placeholder="Sort by"
          class="w-auto lg:w-8rem"
        />

        <Button variant="link" @click="toggleView()"
          ><div v-show="sortView === 'GRID'"><span class="pi pi-list" /></div>
          <div v-show="sortView === 'LIST'"><span class="pi pi-th-large" /></div
        ></Button>
      </div>
    </div>
  </div>

  <div v-show="isLoading">
    <div class="p-2 col-12 lg:col-3 inline-block" v-for="index in 20" :key="index">
      <div class="w-full border-round-2xl p-3 flex flex-column justify-content-between card-bg">
        <Skeleton class="mb-2 h-2rem"></Skeleton>
        <Skeleton class="mb-2 w-6 h-1rem"></Skeleton>
        <Skeleton class="h-2rem"></Skeleton>
      </div>
    </div>
  </div>

  <div v-show="!isLoading && allBooks.length <= 0">
    <div class="col-12 text-center">No books found</div>
  </div>

  <div class="grid" v-show="!isLoading">
    <div v-show="sortView === 'GRID'" class="w-full">
      <div
        class="p-2 col-12 lg:col-3 inline-block"
        v-show="booksToRender.length >= 0"
        v-for="book in booksToRender"
        :key="book.id"
      >
        <Card>
          <template #title>{{ book.title }}</template>
          <template #subtitle>{{ book.author }}</template>

          <template #footer>
            <div class="align-content-center mt-1 mb-3">${{ book?.price }}</div>
            <div class="flex gap-4">
              <Button label="View Details" class="w-1/2" @click="navigateToBook(book.id)" />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <div v-show="sortView === 'LIST'" class="w-full">
      <div class="p-2 col-12 inline-block" v-for="book in booksToRender" :key="book.id">
        <div class="border-none border-round-xl card-bg px-4">
          <div class="flex justify-content-between">
            <div>
              <p class="text-xl font-medium">{{ book.title }}</p>
              <p>{{ book.author }}</p>
            </div>
            <div class="grid gap-4 align-content-center">
              <div class="align-content-center">${{ book?.price }}</div>
              <div class="align-content-center">
                <Button label="View Details" @click="navigateToBook(book.id)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-bg {
  background-color: #18181b;
}
</style>
