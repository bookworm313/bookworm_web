<template>
    <div class="search">
        <!-- Display spinner while loading -->
        <span v-if="answerStore.loading">
            <font-awesome-icon icon="spinner" class="icon spinner" spin />
            Searching...
        </span>

        <!-- Show instructions if no data is loaded -->
        <span v-else-if="!answerStore.loading && !hasResults">
            <font-awesome-icon icon="info-circle" />
            Search books, authors, publication years, etc. in the navbar search bar and results will be shown here.
        </span>

        <!-- Show results or no-results message -->
        <div v-else>
            <h1>Results for "{{ answerStore.data.query }}"</h1>
            <span v-if="!hasBooks">
                No books found for "{{ answerStore.data.query }}". Please try a different search term.
            </span>
            <BookResult v-else v-for="book in answerStore.data.books" :key="book.olid" :olid="book.olid"
                :coverURI="book.cover_uri" :author-names="book.author_names" :title="book.title"
                :publication-year="book.publication_year" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAnswerStore } from '../../../store/index';
import BookResult from '../../components/BookResult.vue';

const answerStore = useAnswerStore();

// Computed properties for dynamic state
const loading = computed(() => answerStore.loading);
const hasResults = computed(() => Object.keys(answerStore.data).length > 0);
const hasBooks = computed(() => answerStore.data?.books?.length > 0);
</script>
