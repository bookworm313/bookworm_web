<template>
    <div class="search">
        <span v-if="Object.keys(answerStore.data).length === 0">
            <font-awesome-icon icon="spinner" class="icon spinner" spin />
            Searching...
        </span>
        <h1 v-else>Results for "{{ answerStore.data.query }}"</h1>
        <span v-if="answerStore.data?.books?.length === 0">
            No books found for "{{ answerStore.data.query }}". Please try a different search term.
        </span>
        <BookResult v-else v-for="book in answerStore.data.books" :olid="book.olid" :coverURI="book.cover_uri"
            :author-names="book.author_names" :title="book.title" :publication-year="book.publication_year" />
    </div>
</template>

<script setup>
import { useAnswerStore } from '../../../store/index'
import BookResult from '../../components/BookResult.vue';

const answerStore = useAnswerStore();
console.log("Books: ", answerStore.data.books)

</script>

<style scoped></style>