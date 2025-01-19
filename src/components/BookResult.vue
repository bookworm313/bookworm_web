<template>
    <div class="book" >
        <div class="cover-container" >
            <img :src="props.coverUri" class="image" alt="No Cover" @click="showBookInfo()"/>
        </div>
        <div class="desc-container">
            <h3 class="authors">{{ props.authorNames?.join(", ") }} ({{ props.publishYear }})</h3>
            <h2 class="title">{{ props.title }}</h2>
            <h3 class="subtitle">{{ props.subtitle }}</h3>
        </div>
        <div class="options-container">
            <MultiSelect class="list-select"
                v-model="selectedLists"
                @before-hide="updateLists()"
                :options="lists"
                optionLabel="name"
                placeholder="Add to list"
                :maxSelectedLabels="1"
                :selectedItemsLabel="'In ' + selectedLists?.length + ' lists'" />
        </div>
    </div>
    <Dialog v-model:visible="bookDialog" modal class="bookInfoDialog" :style="{background:'#ecdeaa', border: 'none'}">
        <img :src="Book?.edition?.cover_uri" alt="No Cover" v-if="Book.edition?.cover_uri">
        <h1>{{ Book?.title }}</h1>
        <h2>{{ Book?.subtitle }}</h2>
        <h3>{{ Book?.authors?.name}}</h3>
        <div id="authorInfo">
            <p>DOB: {{ Book?.authors?.birth_date || "Unknown"}}</p>
            <p hidden>{{ Book?.authors?.bio }}</p>
        </div>
        <h3>{{ Book.edition?.title }}, {{ Book.edition?.publisher || "Unknown publisher" }}, {{ Book?.edition?.publish_date }}</h3>   
        <p>{{ Book?.description || "Missing description"}}</p>
    </Dialog>
</template>

<script setup>
const loggedInUserId = 1;

import { computed, onBeforeMount, ref } from 'vue';
import MultiSelect from 'primevue/multiselect';
import { getUserLists, updateBookBelonging } from '../../services/serverApi';
import { fetchBook } from '../utils/openlibrary';

const lists = ref([]);
const selectedLists = ref(null);
onBeforeMount(async () => {
    lists.value = await getUserLists(loggedInUserId); // TODO: Login
    selectedLists.value = lists.value.filter((list) => list.booksOlid.includes(props.olid));
})

async function updateLists() {
    const selectedListsIds = selectedLists.value.map((l) => l.id);
    await updateBookBelonging(loggedInUserId, selectedListsIds, props.olid);
}

const props = defineProps({
    olid: String,
    title: String,
    subtitle: String,
    authorNames: Array,
    publishYear: [Number, String],
    coverUri: String,
    review: Number
})

const Book = ref(null);  
const bookDialog = ref(false);

//Shows dialog box and fetches book data from fetchBook()
const showBookInfo = async () => {
    Book.value = await fetchBook(props.olid);      
    bookDialog.value = true;
}
const showAuthorInfo= () => {
  var x = document.getElementById("authorInfo");
  if (x.style.display === "none") {
    x.style.display = "block    ";
  } else {
    x.style.display = "none";
  }
}
</script>

<style scoped>
.book {
    min-height: 200px;
    display: grid;
    grid-template-columns: 120px auto 200px;
    position: relative;
    gap: 15px;
    background-color: #ecdeaa;
    padding: 15px;
    border-radius: 5px;
}

.cover-container {
    width: 120px;
    min-height: 170px;
}

.image {
    width: 120px;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.authors {
    font-size: 16px;
}
.title {
    font-size: 22px;
}
.subtitle {
    font-size: 18px;
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

.options-container {
    width: 200px;
    text-align: right;
}

.list-select {
    max-width: 200px;
}

.p-dialog .image{
    width: auto;
    height: auto;
}
</style>