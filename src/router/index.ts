import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/book-details/:id',
      name: 'book-details',
      component: () => import('../views/BookDetails.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'page-not-found',
      component: () => import('../views/PageNotFound.vue'),
    },
  ],
})

export default router
