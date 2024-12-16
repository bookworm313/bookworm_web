<template>
    <div class="book">
        <div class="cover">
            <img :src="props.coverURI" class="image" alt="img">
        </div>
        <div class="book-info">
            <h2>{{ props.title }}</h2>
            <h3>{{ props.authorNames.join(", ") }}</h3>
            <p>{{ props.publicationYear }}</p>
            <div class="review">
                <span>--</span>
                <font-awesome-icon icon="star" class="icon star" />
            </div>
        </div>
        <div class="options">
            <MultiSelect :options="lists" optionLabel="name" placeholder="Add to lists" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import MultiSelect from 'primevue/multiselect';

const lists = ref(['Favorites', 'Want to read', 'Done reading']);

const props = defineProps({
    olid: String,
    coverURI: String,
    authorNames: Array,
    title: String,
    publicationYear: Number,
})

</script>

<style scoped>
.book {
    display: grid;
    grid-template-columns: 150px 1fr auto;
    grid-template-rows: auto 1fr;
    gap: 10px;
    background-color: #EEDC98;
    padding: 13px;
    border-radius: 5px;
    margin-bottom: 20px;
}

h3 {
    font-style: italic;
}

.review {
    display: flex;
    align-items: center;
    gap: 5px;
    direction: flex;
    align-items: center;
}

.star {
    color: var(--gold);
}

.image {
    width: 100%;
}
</style>