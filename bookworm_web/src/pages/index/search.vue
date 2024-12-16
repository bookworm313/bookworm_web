<template>
    <div class="search">
        <h1 v-if="Object.keys(answerStore.data).length === 0">Loading...</h1>
        <h1 v-else>Results for "{{ answerStore.data.query }}"</h1>
        <BookResult v-for="book in answerStore.data.books"
            :olid="book.olid"
            :cover-uri="book.cover_uri"
            :author-names="book.author_names"
            :title="book.title"
            :publication-year="book.publication_year" />
    </div>
</template>

<script setup>
import { useAnswerStore } from '../../../store/index'
import BookResult from '../../components/BookResult.vue';

const answerStore = useAnswerStore();

</script>

<style scoped></style>