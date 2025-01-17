<template>
    <section>
        <div class="logo-container">
            <img src="../assets/images/bookworm-logo.svg" alt="Logo" class="logo" />
        </div>
        <div class="nav-content">
            <IconField>
                <InputIcon :class="loader ? 'pi pi-spin pi-spinner' : 'pi pi-search'" />
                <InputText @keydown.enter="answerStore.loading == true; initiateQuery();" v-model="search"
                    placeholder="Search books, authors, etc." />
            </IconField>
            <div class="options">
                <Button icon="pi pi-plus" label="Test" @click="showAddListDialog()" />
                <div class="icons">
                    <font-awesome-icon class="icon" icon="user-gear" size="lg" />
                </div>
            </div>
        </div>
    </section>
    <Dialog v-model:visible="dialogVisible" modal header="Add List" :style="{ width: '25rem' }">
        <div style="display: flex; justify-content: space-between;" class="flex items-center gap-4 mb-4">
            <label for="list-name" class="font-semibold w-24">List name</label>
            <InputText id="list-name" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <Checkbox v-model="listIsVisible" inputId="list-is-visible" binary />
            <label for="list-is-visible"> Visible to other users</label>
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="dialogVisible = false"></Button>
            <Button type="button" label="Save" @click="dialogVisible = false"></Button>
        </div>
    </Dialog>
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
            console.log("Rezultat pretraživanja: ", results);
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

const dialogVisible = ref(false);
const listIsVisible = ref(false);

const showAddListDialog = () => {
    dialogVisible.value = true;
}
</script>


<style scoped>
section {
    width: 100%;
    height: 80px;
    display: flex;
    position: fixed;

    background-color: var(--primary);
    box-shadow: 0 5px 10px rgba(168, 172, 187, 0.05), 0 5px 20px rgba(177, 181, 197, 0.2);
}
.nav-content {
    width: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    padding: 26px;
}

.logo-container {
    width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.logo {
    width: 198px;
    height: 54px;
    object-fit: contain;
}

.icon:hover {
    transform: scale(1.05);
    cursor: pointer;
}

.icon:active {
    transform: scale(0.95);
}
</style>