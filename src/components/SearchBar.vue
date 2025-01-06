<script setup lang="ts">
// Imports
import { watch } from 'vue'
import { useBooksStore } from './src/stores/books'
import { storeToRefs } from 'pinia'

// UI Components
import { InputText } from 'primevue'

// Variables
const { searchQuery, getSearchQuery } = storeToRefs(useBooksStore())
const { searchByText } = useBooksStore()

// Functions
watch(getSearchQuery, () => {
  searchByText(searchQuery.value)
})
</script>

<template>
  <div aria-label="search-input" class="col-12 lg:col-4 align-content-center">
    <InputText class="w-full" type="text" v-model="searchQuery" placeholder="Find a book..." />
  </div>
</template>
