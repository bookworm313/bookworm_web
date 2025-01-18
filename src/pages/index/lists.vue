<template>
    <div class="lists">
        <div class="h1-header">
            <h1>{{ listName }}</h1>
            <Button class="p-button" label="Add book" icon="pi pi-plus" @click="isDialogVisible = true" />
        </div>
        <hr>
        <div class="books">
            <!-- <Book v-for="book in filteredBooks" :key="book.id" :name="book.name" :description="book.description"
                :review="book.review" /> -->
            <span v-if="books.length === 0 && loadingBooks">
                <font-awesome-icon icon="spinner" class="icon spinner" spin />
                Loading books...
            </span>
            <template v-else-if="books.length === 0 && !loadingBooks">
                <p>No books found.</p>
            </template>
            <template v-else>
                <Book v-for="book in books" :list-id="list.id" :olid="book.olid" :title="book.title" :subtitle="book.subtitle"
                    :author-names="book.authors" :publish-year="book.publish_year" :cover-uri="book.cover_uri" :review="book.review" />
            </template>

            <!--
                const props = defineProps({
                    key: String || Number,
                    name: String,
                    author: String,
                    publicationYear: Number,
                    description: String,
                    image: Blob,
                    review: Number
                })
            -->
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
const loggedInUserId = 1;

import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchBooksByOLID } from '../../utils/openlibrary';
import { getUserLists } from '../../../services/serverApi';

const route = useRoute();

const isDialogVisible = ref(false)


const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const groqApiUrl = import.meta.env.VITE_GROQ_API_URL;

console.log("Groq API Key:", groqApiKey);
console.log("Groq API URL:", groqApiUrl);


const listName = computed(() => {
    const hash = route.hash.slice(1);
    // Replace underscores with spaces and capitalize the first letter of each word
    return hash
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
});

const lists = ref([]); // Sve liste
const list = ref(null); // Lista odabrana za prikazati
const books = ref([]); // Knjige iz odabrane liste
const bookIds = ref([null]) // (OL)ID-jevi knjiga iz odabrane liste

const loadingBooks = ref(true); // Označava da se knjige trenutno dohvaćaju

const hash = computed(() => route.hash.slice(1));

watch (hash, async () => {

    lists.value = await getUserLists(loggedInUserId);

    if (lists.value.length) { // Provjeri da `lists` nije prazan
        list.value = lists.value.find((list) =>
            list.name.toLowerCase().replace(/\s+/g, '_') === hash.value
        );
        console.log("Nađena lista: ", list.value);
        books.value = [];
        loadingBooks.value = true;

        if (list.value) {
            bookIds.value = list.value.booksOlid
                .filter((id) => id.trim());
            console.log("ID-ovi knjiga: ", bookIds.value);

            // Dohvati knjige s Open Library API-a
            try {
                //console.log("Prazne knjige: ", books.value);
                books.value = await fetchBooksByOLID(bookIds.value);
                console.log("Dohvaćene knjige: ", books.value);
                loadingBooks.value = false;

            } catch (error) {
                console.error("Greška kod dohvaćanja knjiga: ", error);
            }
        }
    }
},
{ immediate: true })

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
    gap: 20px;
    padding: 20px;
}

.secondary {
    background-color: #eeeeee !important;
}

.secondary:hover {
    background-color: #ddd !important;
}
</style>