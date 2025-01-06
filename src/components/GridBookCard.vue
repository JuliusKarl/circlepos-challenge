<script setup lang="ts">
// Imports
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'
import type { Book } from '@/types/books'
import type { PropType } from 'vue'

// UI Components
import { Card, Button } from 'primevue'

// Variables
const router = useRouter()

// Functions
const navigateToBook = (id: number) => {
  router.push({ name: 'book-details', params: { id: id } })
}

// Props
const props = defineProps({
  book: {
    type: Object as PropType<Book>,
  },
})
</script>

<template>
  <Card aria-label="book-card" class="shadow-2">
    <template #title>{{ props.book?.title }}</template>
    <template #subtitle>{{ props.book?.author }}</template>

    <template #footer>
      <div class="align-content-center mt-1 mb-3">${{ props.book?.price }}</div>
      <div class="flex gap-4">
        <Button
          v-if="props.book"
          role="button"
          aria-pressed="false"
          label="View Details"
          class="w-1/2"
          @click="navigateToBook(props.book?.id)"
        />
      </div>
    </template>
  </Card>
</template>
