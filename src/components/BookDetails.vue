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
      transactionResponseHeader.value = response.data.message
      isPurchasing.value = false
      showSuccessModal.value = true
      await getBookDetails()
    })
    .catch((error) => {
      console.error(error)
      transactionResponseHeader.value = error.response.data.message
      isPurchasing.value = false
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
  <div class="flex justify-content-center">
    <div v-if="!isLoading" class="inline-block">
      <h1>{{ book?.title }}</h1>
      <p>Author: {{ book?.author }}</p>
      <p>ISBN: {{ book?.isbn }}</p>
      <p>Stock: {{ book?.availableStock }}</p>
      <p>Price: ${{ book?.price }}</p>

      <Button
        class="mt-2"
        :loading="isPurchasing"
        @click="buyNow()"
        :disabled="book?.availableStock <= 0"
      >
        <span v-if="book?.availableStock <= 0">Out of stock</span>
        <span v-else-if="!isPurchasing">Buy now</span>
      </Button>
    </div>

    <div v-if="isLoading" class="inline-block w-2 pt-3">
      <Skeleton class="mb-4 h-3rem"></Skeleton>
      <Skeleton class="mb-3 w-9 h-1rem"></Skeleton>
      <Skeleton class="mb-3 w-8 h-1rem"></Skeleton>
      <Skeleton class="mb-3 w-4 h-1rem"></Skeleton>
      <Skeleton class="mb-4 w-6 h-1rem"></Skeleton>
      <Skeleton class="w-5 h-3rem"></Skeleton>
    </div>
  </div>

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
.card-bg {
  background-color: #18181b;
}
.error-text {
  color: #ff0000;
}
</style>
