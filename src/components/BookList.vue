<script setup lang="ts">
// Imports
import { watch, onMounted } from 'vue'
import { useBooksStore } from '/src/stores/books'
import { storeToRefs } from 'pinia'

// UI Components
import SearchBar from './SearchBar.vue'
import FilterPanel from './FilterPanel.vue'
import SkeletonCard from './SkeletonCard.vue'
import GridBookCard from './GridBookCard.vue'
import ListBookCard from './ListBookCard.vue'

// Variables
const { isLoading, booksToRender, sortType, sortView, getSortType } = storeToRefs(useBooksStore())
const { fetchBooks, sortByType } = useBooksStore()

// Functions
watch(getSortType, () => {
  sortByType(sortType.value.sort)
})

// Hooks
onMounted(() => {
  fetchBooks()
})
</script>

<template>
  <div class="grid">
    <h1 class="col-12 lg:col-4 inline-block" id="title">All Books</h1>
    <SearchBar />
    <FilterPanel />
  </div>

  <div v-show="isLoading" aria-labelledby="title">
    <div class="p-2 col-12 lg:col-3 inline-block" v-for="index in 20" :key="index">
      <SkeletonCard />
    </div>
  </div>

  <div v-show="!isLoading && booksToRender.length <= 0" aria-labelledby="title">
    <div class="col-12 text-center">No books found</div>
  </div>

  <div class="grid" v-show="!isLoading" aria-labelledby="title">
    <div
      class="p-2 col-12 inline-block"
      :class="{ 'lg:col-3': sortView === 'GRID' }"
      v-show="booksToRender.length >= 0"
      v-for="book in booksToRender"
      :key="book.id"
    >
      <div v-show="sortView === 'GRID'">
        <GridBookCard v-bind:book="book" />
      </div>
      <div v-show="sortView === 'LIST'" class="w-full">
        <ListBookCard v-bind:book="book" />
      </div>
    </div>
  </div>
</template>
