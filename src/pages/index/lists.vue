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
                <!-- <BookResult v-for="book in books" :key="book.olid" :olid="book.olid" :coverURI="book.cover.medium"
                    :author-names="book.authors[0].name" :title="book.title" :publication-year="book.publish_date" /> -->
                <Book v-for="book in books" :olid="book.e_olid" :title="book.title" :cover-uri="book.edition.cover_uri"
                    :author-names="book.authors.map((author) => author.name)" :description="book.description"
                    :publication-year="book.publish_date" :review="book.review" />
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
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { generateBookDescription } from '../../../services/groqService';
import axios from 'axios';

import listsData from '/src/data/lists.json'
import { fetchBook } from '../../utils/openlibrary';

const route = useRoute();

const lists = computed(() => listsData);
const list = ref(null);

const isDialogVisible = ref(false)
const bookIds = ref([null])

const loadingBooks = ref(true);

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

const books = ref([]);

const filteredBooks = computed(() => {
    const hash = route.hash.slice(1); // Remove the '#' from the hash
    return books.value.filter(book => hash ? book.type === hash : true);
});

// Funkcija za dohvat knjiga na temelju ID-jeva
async function fetchBooksByIds(ids) {

    const fetchedBooks = [];
    for (const id of ids) {
        const book = await fetchBook(id);
        fetchedBooks.push(book);
    }

    /*const baseUrl = 'https://openlibrary.org/api/books';
    const requests = ids.map(id => {
        return axios.get(`${baseUrl}?bibkeys=OLID:${id}&format=json&jscmd=data`)
            .then(response => response.data[`OLID:${id}`]) // Izvuci podatke za odgovarajući OLID
            .catch(error => {
                console.error(`Greška za OLID ${id}: `, error);
                return null; // Vrati null ako je greška
            });
    });

    // Izvrši sve zahtjeve paralelno
    const results = await Promise.all(requests);
    return results.filter(book => book); // Ukloni null vrijednosti*/

    return fetchedBooks;
}

watchEffect(async () => {
    const hash = route.hash.slice(1);

    if (lists.value.length) { // Provjeri da `lists` nije prazan
        console.log("Hash: ", hash);
        list.value = lists.value.find((list) =>
            list.name.toLowerCase().replace(/\s+/g, '_') === hash
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
                books.value = await fetchBooksByIds(bookIds.value);
                console.log("Dohvaćene knjige: ", books.value);
                loadingBooks.value = false;

            } catch (error) {
                console.error("Greška kod dohvaćanja knjiga: ", error);
            }
        }
    }
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