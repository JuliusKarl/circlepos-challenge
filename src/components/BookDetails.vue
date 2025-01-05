<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// UI Components
import { Card, Button, Skeleton, Dialog } from 'primevue'

// Variables
const isLoading = ref(true)
const isPurchasing = ref(false)
const showSuccessModal = ref(false)
const transactionResponseHeader = ref()
const book = ref()
const route = useRoute()

// Functions
const buyNow = async () => {
  transactionResponseHeader.value = ''
  isPurchasing.value = true

  await axios
    .post(import.meta.env.VITE_API_URL + '/books/' + route.params.id + '/purchase')
    .then((response) => {
      transactionResponseHeader.value = response.data.message
      isPurchasing.value = false
      showSuccessModal.value = true
    })
    .catch((error) => {
      console.error(error)
      transactionResponseHeader.value = error.response.data.message
      isPurchasing.value = false
    })
}

const closeModal = () => {
  showSuccessModal.value = false
  transactionResponseHeader.value = ''
}

// Hooks
onMounted(async () => {
  await axios
    .get(import.meta.env.VITE_API_URL + '/books/' + route.params.id)
    .then((response) => {
      book.value = response.data.book
      isLoading.value = false
    })
    .catch((error) => {
      console.error(error)
      isLoading.value = false
    })
})
</script>

<template>
  <h1>Book Details</h1>
  <div
    v-if="isLoading"
    class="w-3 h-8rem flex flex-column justify-content-between skeleton-container"
  >
    <Skeleton class="mb-2 h-2rem"></Skeleton>
    <Skeleton class="mb-2 w-6 h-1rem"></Skeleton>
    <Skeleton class="h-2rem"></Skeleton>
  </div>

  <Card class="w-3" v-show="!isLoading">
    <template #title>{{ book?.title }}</template>
    <template #subtitle>{{ book?.author }}</template>

    <template #footer>
      <div class="flex gap-4 mt-1">
        <div class="align-content-center">${{ book?.price }}</div>
        <Button
          :loading="isPurchasing"
          class="w-full"
          @click="buyNow()"
          :disabled="book?.availableStock <= 0"
        >
          <span v-if="book?.availableStock <= 0">Out of stock</span>
          <span v-else-if="!isPurchasing">Buy now</span>
        </Button>
      </div>
    </template>
  </Card>
  <p class="error-text" v-show="transactionResponseHeader && !showSuccessModal">
    {{ transactionResponseHeader }}
  </p>

  <Dialog
    v-model:visible="showSuccessModal"
    :header="transactionResponseHeader"
    modal
    :closable="false"
    :draggable="false"
    class="modal"
  >
    <p class="block">
      Your purchase of <b>{{ book?.title }}</b> by {{ book?.author }} was successful.
    </p>
    <Button label="Close" @click="closeModal()" />
  </Dialog>
</template>

<style scoped>
.skeleton-container {
  background-color: #18181b;
  border-radius: 12px;
  padding: 1rem;
}
.error-text {
  color: #ff0000;
}
</style>
