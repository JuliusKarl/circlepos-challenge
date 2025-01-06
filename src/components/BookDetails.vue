<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// UI Components
import { Button, Skeleton, Dialog } from 'primevue'

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
    .then(async (response) => {
      isPurchasing.value = false
      showSuccessModal.value = true
      transactionResponseHeader.value = response.data.message
      await getBookDetails()
    })
    .catch((error) => {
      console.error(error)
      isPurchasing.value = false
      transactionResponseHeader.value = error.response.data.message
    })
}

const getBookDetails = async () => {
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
}

const closeModal = () => {
  showSuccessModal.value = false
  transactionResponseHeader.value = ''
}

// Hooks
onMounted(async () => {
  await getBookDetails()
})
</script>

<template>
  <div class="flex w-full justify-content-center">
    <div v-if="!isLoading && book" class="inline-block" aria-label="book-details">
      <p class="text-6xl lg:text-7xl m-0" id="title">{{ book?.title }}</p>
      <p class="text-2xl lg:text-4xl m-0 mb-6 text-500" id="author">
        {{ book?.author }}
      </p>
      <p id="isbn"><span class="font-bold">ISBN:</span> {{ book?.isbn }}</p>
      <p id="stock"><span class="font-bold">Stock:</span> {{ book?.availableStock }}</p>
      <p id="price"><span class="font-bold">Price:</span> ${{ book?.price }}</p>
      <Button
        role="button"
        aria-pressed="false"
        class="mt-4 w-full"
        @click="buyNow()"
        :loading="isPurchasing"
        :disabled="book?.availableStock <= 0"
      >
        <span v-if="book?.availableStock <= 0">Out of stock</span>
        <span v-else-if="!isPurchasing">Buy now</span>
      </Button>
      <p
        id="error-text"
        class="text-red-500"
        v-show="transactionResponseHeader && !showSuccessModal"
      >
        {{ transactionResponseHeader }}
      </p>
    </div>

    <div v-if="isLoading" class="inline-block w-full lg:w-5" aria-label="loading-cards">
      <Skeleton class="mb-3 h-4rem"></Skeleton>
      <Skeleton class="mb-6 w-6 h-2rem"></Skeleton>
      <Skeleton class="mb-4 w-6 h-1rem"></Skeleton>
      <Skeleton class="mb-4 w-6 h-1rem"></Skeleton>
      <Skeleton class="mb-5 w-6 h-1rem"></Skeleton>
      <Skeleton class="h-2rem"></Skeleton>
    </div>
  </div>

  <Dialog
    modal
    v-model:visible="showSuccessModal"
    :header="transactionResponseHeader"
    :position="'top'"
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
