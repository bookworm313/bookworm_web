<template>
    <div class="carousel-item">
		<Skeleton v-if="!props.bookData.cover_uri" width="200px" height="333px"></Skeleton>
		<img v-else :src="props.bookData.cover_uri" @error="console.log('NO IMAGE', props.bookData.olid)" >
		<div class="carousel-item-desc">
			<p class="book-authors">{{ props.bookData.authors?.join(', ') }}</p>
			<p class="book-title"  @click="showBookInfo()">{{ props.bookData.title }}</p>
			<MultiSelect v-if="props.isNew"
				v-model="selectedLists"
				@before-hide="updateLists()"
				:options="lists"
				optionLabel="name"
				placeholder="Add to list"
				:maxSelectedLabels="0"
				:selectedItemsLabel="selectedLists?.length + (selectedLists?.length > 1 ? ' lists' : ' list')" />
				<p v-else>{{ (props.bookData.publish_year) ? ("(" + props.bookData.publish_year + ")") : ("&nbsp;") }}</p>
		</div>
	</div>

    <Dialog v-model:visible="dialogIsVisible" modal :style="{background:'#ecdeaa', border: 'none', width: '50%', height: '70%'}">
        <div class="dialog-container">
            <div class="dialog-side">
                <div class="dialog-side-content">
                    <Skeleton v-if="!Book" width="200px" height="300px"></Skeleton>
                    <img v-else :src="props.bookData.cover_uri" alt="No Cover">
                    <Skeleton v-if="!Book" width="200px" height="20px" style="margin-top: 10px"></Skeleton>
                    <p v-else>Publish date: {{ Book?.edition?.publish_date || "unknown" }}</p>
                </div>
            </div>
            <div class="dialog-main">
                <Skeleton v-if="!Book" width="100%" height="30px"></Skeleton>
                <h2 v-else>{{ Book?.authors.map((author) => author.name).join(", ")}}</h2>
                <Skeleton v-if="!Book" width="100%" height="50px" style="margin-top: 10px"></Skeleton>
                <h1 v-else>{{ Book?.title }}</h1>
                <Skeleton v-if="!Book" width="100%" height="30px" style="margin-top: 10px"></Skeleton>
                <h2 v-else>{{ Book?.subtitle }}</h2>
                <Skeleton v-if="!Book" width="100%" height="300px" style="margin-top: 10px"></Skeleton>
                <p v-else>{{ Book?.description || "No description available"}}</p>
                <div v-for="author in Book?.authors" class="author-info">
                    <h3>About {{ author.name }}</h3>
                    <p>Born: {{ author.birth_date || "unknown"}}</p>
                    <p>{{ author.bio }}</p>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
const loggedInUserId = 1;

import { computed, onBeforeMount, ref, watch } from 'vue';
import { MultiSelect, Skeleton } from 'primevue';
import { getUserLists, updateBookBelonging } from '../../services/serverApi';
import { fetchBook } from '../utils/openlibrary';

const props = defineProps({
	isNew: Boolean,
	bookData: Object
})

const lists = ref([]);
const selectedLists = ref(null);
onBeforeMount(async () => {
    lists.value = await getUserLists(loggedInUserId); // TODO: Login
    selectedLists.value = lists.value.filter((list) => list.booksOlid.includes(props.bookData.olid));
})

async function updateLists() {
    const selectedListsIds = selectedLists.value.map((l) => l.id);
    await updateBookBelonging(loggedInUserId, selectedListsIds, props.bookData.olid);
}

watch(() => props.bookData, async () => {
	selectedLists.value = lists.value.filter((list) => list.booksOlid.includes(props.bookData.olid));
})


const Book = ref(null);  
const dialogIsVisible = ref(false);
const showBookInfo = async () => {  
    dialogIsVisible.value = true;
    Book.value = await fetchBook(props.bookData.olid); 
}

</script>

<style scoped>

.carousel-item {
    width: 150px;
    height: 250px;
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 5px;
    background-color: var(--bg);
}
.carousel-item img {
    width: 100%;
    height: 100%; 
    object-fit: cover;
    z-index: 0;
}
.carousel-item-desc {
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 20px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    text-align: center;

    color: rgba(255, 255, 255, 0);
    backdrop-filter: blur(0px);
    filter: brightness(1);
    transition: color .5s, backdrop-filter .5s, brightness 1s;
}
.carousel-item:hover .carousel-item-desc {
    color: rgba(255, 255, 255, 1);
    backdrop-filter: blur(10px) brightness(0.5);
    transition: color .5s, backdrop-filter .5s, brightness 1s;
}

.book-title {
    font-size: 16px;
	font-weight: bold;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3; /* number of lines to show */
    		line-clamp: 3; 
	-webkit-box-orient: vertical;
    user-select: none;
}
.book-authors {
    font-size: 14px;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2; /* number of lines to show */
    		line-clamp: 2; 
	-webkit-box-orient: vertical;
    user-select: none;
}

.p-multiselect {
	width: 110px;
	visibility: hidden;
}
.carousel-item:hover .p-multiselect {
    visibility: visible;
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