<template>
    <div class="library-container">
        <div class="library-header">
            <h2>Library</h2>
        </div>
        <form @submit.prevent="searchBooks">
            <input v-model="query" type="text" placeholder="Search for books..." required />
            <button type="submit">Search</button>
        </form>
        <div v-if="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div class="library-content">
            <div v-if="books.length" class="books-list">
                <div v-for="book in books" :key="book.id" class="book-card">
                    <img :src="book.volumeInfo.imageLinks?.thumbnail" alt="Book cover" />
                    <h3>{{ book.volumeInfo.title }}</h3>
                    <p>{{ book.volumeInfo.authors?.join(', ') }}</p>
                    <p>{{ book.volumeInfo.publishedDate }}</p>
                </div>
            </div>
            <div v-else-if="!loading && !error" class="no-books">
                <p>No books found. Try searching for something!</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
    name: "LibraryComponent",
    setup() {
        const query = ref("");
        const books = ref([]);
        const loading = ref(false);
        const error = ref("");

        const searchBooks = async () => {
            if (!query.value) return;
            loading.value = true;
            error.value = "";
            books.value = [];
            try {
                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query.value)}`
                );
                const data = await response.json();
                if (data.items) {
                    books.value = data.items;
                } else {
                    books.value = [];
                }
            } catch (err) {
                error.value = "Failed to fetch books.";
            } finally {
                loading.value = false;
            }
        };

        // Load popular books on mount (e.g., bestsellers or a popular keyword)
        onMounted(async () => {
            loading.value = true;
            error.value = "";
            books.value = [];
            try {
                // You can change the query to another popular keyword if you want
                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=bestsellers`
                );
                const data = await response.json();
                if (data.items) {
                    books.value = data.items;
                }
            } catch (err) {
                error.value = "Failed to fetch popular books.";
            } finally {
                loading.value = false;
            }
        });

        return {
            query,
            books,
            loading,
            error,
            searchBooks,
        };
    },
};
</script>

<style scoped>
.library-container {
    max-width: 1000px;
    min-height: 80vh;
    margin: 2rem auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    border-radius: 16px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.library-header {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
}

.library-header h2 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
}

form {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
}

input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 300px;
}

button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    background: #2c3e50;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
}

.library-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    flex: 1;
}

.books-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
}

.book-card {
    background: #e3eafc;
    border: 1px solid #b6c6e3;
    border-radius: 12px;
    padding: 1.5rem 1rem;
    width: 200px;
    min-height: 320px;
    max-height: 320px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow 0.2s;
    overflow: hidden;
}

.book-card h3 {
  min-height: 48px;
  max-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.book-card p {
  margin: 0.2rem 0;
  max-width: 100%;
  max-height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-card:hover {
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.15);
    background: #d6e4ff;
}

.book-card img {
    max-width: 100px;
    margin-bottom: 1rem;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(44, 62, 80, 0.08);
}

.no-books {
    width: 100%;
    text-align: center;
    color: #888;
    font-size: 1.1rem;
    margin-top: 2rem;
}

.error {
    color: red;
    margin-top: 1rem;
    text-align: center;
}
</style>