<template>
    <section>
        <IconField>
            <InputIcon class="pi pi-search" />
            <InputText @keydown.enter="initiateQuery" v-model="search" placeholder="Search books, authors, etc." />
        </IconField>
        <div class="icons">
            <font-awesome-icon class="icon" icon="user-gear" size="lg" />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchBooks } from '../utils/openlibrary'
import { useAnswerStore } from '../../store/index'

const answerStore = useAnswerStore();

const router = useRouter();

const search = ref(null);
const searchSection = ref({
    label: 'Search', to: '/search', icon: '', isActive: false,
});

const initiateQuery = async () => {
    if (search.value.trim().length > 0) {
        answerStore.$reset();
        router.push(searchSection.value.to);
        answerStore.data = await fetchBooks(search.value, "eng", 10, 1);
        console.log("fetch complete", answerStore.data);
    }
}

</script>

<style scoped>
section {
    height: 100%;
    padding: 26px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: var(--primary);
}

.icon:hover {
    transform: scale(1.05);
    cursor: pointer;
}

.icon:active {
    transform: scale(0.95);
}
</style>