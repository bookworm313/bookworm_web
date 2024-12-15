<template>
    <div class="book">
        <img src="../assets/images/image.png" class="image" alt="img">
        <h2>{{ props.name }}</h2>
        <p class="description">
            {{ props.description }}
        </p>
        <!-- <div class="progress"></div> -->
        <font-awesome-icon icon="trash" class="icon trash" size="lg" />
        <div class="review">
            <span>{{ props.review }} </span>
            <font-awesome-icon icon="star" class="icon star" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    key: String || Number,
    name: String,
    description: String,
    image: Blob,
    review: Number
})

</script>

<style scoped>
.book {
    display: grid;
    grid-template-columns: 150px 1fr auto;
    grid-template-rows: auto 1fr auto;
    gap: 10px;
    background-color: #EEDC98;
    padding: 13px;
    border-radius: 5px;
}

h2 {
    grid-column: 2 / 3;
}

p {
    grid-column: 2 / 3;
}

.description {
    text-align: justify;
}

.review {
    display: flex;
    align-items: center;
    gap: 5px;
    grid-row: 3;
    direction: flex;
    align-items: center;
}

.trash {
    grid-column: 3;
    grid-row: 1;
    color: var(--red);
}

.trash:hover {
    cursor: pointer;
    transform: scale(1.05);
}

.trash:active {
    transform: scale(0.95);
}

.star {
    color: var(--gold);
}

.image {
    width: 100%;
    grid-row: 1 / 4;
}
</style>