<template>
    <div class="book">
        <div class="cover-container">
            <img :src="props.coverUri" class="image" alt="No Cover" @click="showBookInfo()" />
        </div>
        <div class="desc-container">
            <h3 class="authors">{{ props.authorNames?.join(", ") }} ({{ props.publishYear }})</h3>
            <h2 class="title">{{ props.title }}</h2>
            <h3 class="subtitle">{{ props.subtitle }}</h3>
        </div>
        <div class="options-container">
            <MultiSelect class="list-select" v-model="selectedLists" @before-hide="updateLists()" :options="lists"
                optionLabel="name" placeholder="Add to list" :maxSelectedLabels="1"
                :selectedItemsLabel="'In ' + selectedLists?.length + ' lists'" />
        </div>
    </div>
    <Dialog v-model:visible="dialogIsVisible" modal
        :style="{ background: '#ecdeaa', border: 'none', width: '50%', height: '70%' }">
        <div class="dialog-container">
            <div class="dialog-side">
                <div class="dialog-side-content">
                    <Skeleton v-if="!Book" width="200px" height="300px"></Skeleton>
                    <img v-else :src="props.coverUri" alt="No Cover">
                    <Skeleton v-if="!Book" width="200px" height="20px" style="margin-top: 10px"></Skeleton>
                    <p v-else>Publish date: {{ Book?.edition?.publish_date || "unknown" }}</p>
                </div>
            </div>
            <div class="dialog-main">
                <Skeleton v-if="!Book" width="100%" height="30px"></Skeleton>
                <h2 v-else>{{ Book?.authors.map((author) => author.name).join(", ") }}</h2>
                <Skeleton v-if="!Book" width="100%" height="50px" style="margin-top: 10px"></Skeleton>
                <h1 v-else>{{ Book?.title }}</h1>
                <Skeleton v-if="!Book" width="100%" height="30px" style="margin-top: 10px"></Skeleton>
                <h2 v-else>{{ Book?.subtitle }}</h2>
                <Skeleton v-if="!Book" width="100%" height="300px" style="margin-top: 10px"></Skeleton>
                <p v-else>{{ Book?.description || "No description available" }}</p>
                <div v-for="author in Book?.authors" class="author-info">
                    <h3>About {{ author.name }}</h3>
                    <p>Born: {{ author.birth_date || "unknown" }}</p>
                    <p>{{ author.bio }}</p>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script setup>

import { computed, onBeforeMount, ref } from 'vue';
import { MultiSelect, Skeleton } from 'primevue';
import { getUserLists, updateBookBelonging } from '../../services/serverApi';
import { fetchBook } from '../utils/openlibrary';

const user = JSON.parse(localStorage.getItem("user"))
const loggedInUserId = user?.id;

console.log("USER: ", user?.id)

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
const dialogIsVisible = ref(false);
const showBookInfo = async () => {
    dialogIsVisible.value = true;
    Book.value = await fetchBook(props.olid);
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

.p-dialog .image {
    width: auto;
    height: auto;
}


.dialog-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 0 10px;
}

.dialog-side {
    position: relative;
    min-width: 200px;
    max-width: 200px;
}

.dialog-side-content {
    width: 200px;
    position: fixed;
}

.dialog-side-content img {
    width: 100%;
}

.author-info {
    margin-top: 10px;
}

.dialog-main {
    flex-grow: 1;
}
</style>