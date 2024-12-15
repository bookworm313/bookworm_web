<template>
    <div class="lists">
        <div class="h1-header">
            <h1>{{ listName }}</h1>
            <Button class="p-button" label="Add book" icon="pi pi-plus" @click="isDialogVisible = true" />
        </div>
        <hr>
        <div class="books">
            <Book v-for="book in filteredBooks" :key="book.id" :name="book.name" :description="book.description"
                :review="book.review" />
        </div>
        <Dialog v-model:visible="isDialogVisible" header="Add book" :style="{ width: '30rem' }"
            @close="isDialogVisible = false">
            <IconField style="width: 100%;">
                <InputIcon class="pi pi-search" />
                <InputText v-model="search" placeholder="Search books, authors, etc." style="width: 100%;" />
            </IconField>
            <template #footer>
                <Button type="button" label="Cancel" severity="secondary" class="secondary"
                    @click="isDialogVisible = false"></Button>
                <Button type="button" label="Save" @click="isDialogVisible = false"></Button>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isDialogVisible = ref(false)

const listName = computed(() => {
    const hash = route.hash.slice(1);
    if (hash === 'favorites') return 'Favorites';
    if (hash === 'wanted') return 'Want to Read';
    if (hash === 'done') return 'Done Reading';
    return 'All Books';
});

const books = ref([
    { id: 1, name: 'Book One', description: 'Description for Book One', review: '9.1', type: 'favorites' },
    { id: 2, name: 'Book Two', description: 'Description for Book Two', review: '8.4', type: 'wanted' },
    { id: 3, name: 'Book Three', description: 'Description for Book Three', review: '8.9', type: 'done' },
    { id: 4, name: 'Book Four', description: 'Description for Book Four', review: '9.5', type: 'favorites' },
    { id: 5, name: 'Book Five', description: 'Description for Book Five', review: '7.8', type: 'wanted' },
    { id: 6, name: 'Book Six', description: 'Description for Book Six', review: '8.7', type: 'done' },
]);

const filteredBooks = computed(() => {
    const hash = route.hash.slice(1); // Remove the '#' from the hash
    return books.value.filter(book => hash ? book.type === hash : true);
});
</script>

<style scoped>
.lists {
    display: flex;
    flex-direction: column;
    gap: 13px;
}

.h1-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.p-button {
    background-color: #2e52ad !important;
    border: none !important;
}

.p-button:hover {
    background-color: #3762cf !important;
}

.p-button:active {
    background-color: #5073cb !important;
}

.books {
    display: grid;
    grid-template-rows: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
    background-color: var(--bg);
}

.secondary {
    background-color: #eeeeee !important;
}

.secondary:hover {
    background-color: #ddd !important;
}
</style>