<script setup lang="ts">
// Imports
import { useRouter } from 'vue-router'

// UI Components
import { Button } from 'primevue'
import { defineProps } from 'vue'
import type { Book } from '@/types/books'
import type { PropType } from 'vue'

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
  <div aria-label="book-card" class="p-card border-none border-round-xl px-4 shadow-2">
    <div class="flex justify-content-between">
      <div>
        <p class="text-xl font-medium">{{ props.book?.title }}</p>
        <p class="text-500">{{ props.book?.author }}</p>
      </div>
      <div class="grid gap-4 align-content-center">
        <div class="align-content-center">${{ props.book?.price }}</div>
        <div class="align-content-center">
          <Button
            v-if="props.book"
            role="button"
            aria-pressed="false"
            label="View Details"
            @click="navigateToBook(props.book?.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
