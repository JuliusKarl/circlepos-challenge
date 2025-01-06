import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Book, SortOrder, SortView } from '@/types/books'

export const useBooksStore = defineStore('books', {
  state: () => ({
    isLoading: ref(true),
    allBooks: ref<Book[]>([]),
    booksToRender: ref<Book[]>([]),
    searchQuery: ref(''),
    sortType: ref({ sort: '' }),
    sortOrder: ref<SortOrder>('ASC'),
    sortView: ref<SortView>('GRID'),
    sortOptions: ref([{ sort: 'Title' }, { sort: 'Author' }, { sort: 'Price' }]),
  }),
  actions: {
    sortByType(sortType: string) {
      switch (sortType) {
        case 'Title':
          this.booksToRender = this.booksToRender.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'Author':
          this.booksToRender = this.booksToRender.sort((a, b) => a.author.localeCompare(b.author))
          break
        case 'Price':
          this.booksToRender = this.booksToRender.sort((a, b) => a.price - b.price)
          break
      }
    },
    searchByText(query: string) {
      this.booksToRender = this.allBooks.filter((book) => {
        return book.title.toLowerCase().includes(query.toLowerCase())
      })
    },
    toggleSort() {
      this.booksToRender = this.allBooks.reverse()
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    },
    toggleView() {
      this.sortView = this.sortView === 'LIST' ? 'GRID' : 'LIST'
    },
    async fetchBooks() {
      await fetch(import.meta.env.VITE_API_URL + '/books')
        .then((response) => response.json())
        .then((data) => {
          this.allBooks = data.books
          this.booksToRender = data.books
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
  getters: {
    getSearchQuery(): string {
      return this.searchQuery
    },
    getSortType(): string {
      return this.sortType.sort
    },
  },
})
