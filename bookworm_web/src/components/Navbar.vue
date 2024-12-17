<template>
    <section>
        <IconField>
            <InputIcon :class="loader ? 'pi pi-spin pi-spinner' : 'pi pi-search'" />
            <InputText @keydown.enter="answerStore.loading == true; initiateQuery();" v-model="search"
                placeholder="Search books, authors, etc." />
        </IconField>
        <div class="icons">
            <font-awesome-icon class="icon" icon="user-gear" size="lg" />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchBooks } from '../utils/openlibrary';
import { useAnswerStore } from '../../store/index';

const answerStore = useAnswerStore();
const router = useRouter();
const loader = ref(false)

const search = ref(null);
const searchSection = ref({
    label: 'Search', to: '/search', icon: '', isActive: false,
});

const initiateQuery = async () => {
    loader.value = true;
    if (search.value.trim().length > 0) {
        answerStore.loading = true; // Set loading to true before navigation and fetching
        console.log("loading on enter: ", answerStore.loading)
        answerStore.$reset();
        router.push(searchSection.value.to);

        try {
            const results = await fetchBooks(search.value, "eng", 10, 1);
            answerStore.data = results || {}; // Store fetched data
        } catch (error) {
            console.error("Error fetching books:", error);
            answerStore.data = {}; // Reset data on error
        } finally {
            answerStore.loading = false; // Set loading to false after fetching
            loader.value = false; // Set loading to false after fetching
        }
    }
};
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