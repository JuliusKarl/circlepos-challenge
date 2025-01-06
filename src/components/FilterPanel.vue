<script setup lang="ts">
// Imports
import { watch } from 'vue'
import { useBooksStore } from '../stores/books'
import { storeToRefs } from 'pinia'

// UI Components
import { Button, Dropdown } from 'primevue'

// Variables
const { sortType, sortView, sortOptions, getSortType } = storeToRefs(useBooksStore())
const { toggleSort, toggleView, sortByType } = useBooksStore()

// Functions
watch(getSortType, () => {
  sortByType(sortType.value.sort)
})
</script>

<template>
  <div aria-label="filter-panel" class="col-12 lg:col-4 text-right align-content-center">
    <div>
      <Button aria-label="order-type" variant="link" @click="toggleSort()"
        ><span class="pi pi-arrow-right-arrow-left rotate-90"
      /></Button>

      <Dropdown
        aria-label="sort-type"
        v-model="sortType"
        :options="sortOptions"
        optionLabel="sort"
        placeholder="Sort by"
        class="w-auto lg:w-8rem"
      />

      <Button aria-label="view-type" variant="link" @click="toggleView()"
        ><div v-show="sortView === 'GRID'"><span class="pi pi-list" /></div>
        <div v-show="sortView === 'LIST'"><span class="pi pi-th-large" /></div
      ></Button>
    </div>
  </div>
</template>
