<script setup lang="ts">
import { Skeleton } from 'primevue'
</script>

<template>
  <div
    aria-label="skeleton-card"
    class="w-full border-round-2xl p-3 flex flex-column justify-content-between"
  >
    <Skeleton class="mb-2 h-2rem"></Skeleton>
    <Skeleton class="mb-2 w-6 h-1rem"></Skeleton>
    <Skeleton class="h-2rem"></Skeleton>
  </div>
</template>
