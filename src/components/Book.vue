<template>
    <div class="book" v-if="!isRemoved" >
        <div class="cover-container" >
            <img :src="props.coverUri" class="image" alt="No Cover" @click="showBookInfo()"/>
        </div>
        <div class="desc-container">
            <h3 class="authors">{{ props.authorNames?.join(", ") }} ({{ props.publishYear }})</h3>
            <h2 class="title">{{ props.title }}</h2>
            <h3 class="subtitle">{{ props.subtitle }}</h3>
        </div>
        <!-- <div class="progress"></div> -->
        <div>
            <font-awesome-icon icon="trash" class="icon trash" size="lg" @click="removeFromList(props.listId, props.olid)" />
        </div>
        <!--<div class="review">
            <span>{{ props.review }} </span>
            <font-awesome-icon icon="star" class="icon star" />
            <MultiSelect v-model="selectedLists" @before-hide="updateLists()" :options="userStore.lists"
                optionLabel="name" placeholder="Add to lists" :disabled="storing ? true : false" />
        </div>-->
    </div>
    <Dialog v-model:visible="bookDialog" modal class="bookInfoDialog" :style="{background:'#ecdeaa', border: 'none'}">
        <img :src="Book?.edition?.cover_uri" alt="No Cover" v-if="Book.edition?.cover_uri">
        <h1>{{ Book?.title }}</h1>
        <h2>{{ Book?.subtitle }}</h2>
        <h3 @click = "showAuthorInfo()">{{ Book?.authors?.name}}</h3>
        <div id="authorInfo">
            <p>DOB: {{ Book?.authors?.birth_date || "Unknown"}}</p>
            <p>{{ Book?.authors?.bio }}</p>
        </div>
        <h3>{{ Book?.edition?.title }}, {{ Book?.edition?.publisher || "Unknown publisher" }}, {{ Book?.edition?.publish_date }}</h3>   
        <p>{{ Book?.description || "Missing description"}}</p>
    </Dialog>
</template>

<script setup>
const loggedInUserId = 1;

import { onBeforeMount, ref } from 'vue';
import { useUserStore } from '../../store/user';
import { removeBookFromList } from '../../services/serverApi';
import { fetchBook } from '../utils/openlibrary';

const userStore = useUserStore();
const selectedLists = ref(null);
const storing = ref(false);

const isRemoved = ref(false);

const coverLoaded = ref(true);
function coverNotFound() {
    coverLoaded.value = false;
}

const props = defineProps({
    listId: Number,
    olid: String,
    title: String,
    subtitle: String,
    authorNames: Array,
    publishYear: [Number, String],
    coverUri: String,
    review: Number
})

onBeforeMount(() => {
    selectedLists.value = userStore.lists.filter((list) => {
        //console.log(list + " includes " + props.olid + ": " + list.books_olid.split(",").includes(props.olid))
        return list.books_olid.split(",").includes(props.olid)
    });
})

async function removeFromList(listId, olid) {
    await removeBookFromList(loggedInUserId, listId, olid);
    isRemoved.value = true;
}
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
    grid-template-columns: 120px auto 17.5px;
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

.desc-container {
    
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
.descr{
    font-size: small;
}
.review {
    display: flex;
    align-items: center;
    gap: 5px;
    direction: flex;
    align-items: center;
}

.trash {
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

.p-dialog .image{
    width: auto;
    height: auto;
}

</style>