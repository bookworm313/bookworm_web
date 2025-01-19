<template>
    <div class="carousel-item">
		<Skeleton v-if="!props.bookData.cover_uri" width="200px" height="333px"></Skeleton>
		<img v-else :src="props.bookData.cover_uri" @error="console.log('NO IMAGE', props.bookData.olid)" >
		<div class="carousel-item-desc">
			<p class="book-authors">{{ props.bookData.authors?.join(',') }}</p>
			<p class="book-title">{{ props.bookData.title }}</p>
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
</template>

<script setup>
const loggedInUserId = 1;

import { computed, onBeforeMount, ref, watch } from 'vue';
import MultiSelect from 'primevue/multiselect';
import { getUserLists, updateBookBelonging } from '../../services/serverApi';

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
}
.book-authors {
    font-size: 14px;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2; /* number of lines to show */
    		line-clamp: 2; 
	-webkit-box-orient: vertical;
}

.p-multiselect {
	width: 110px;
	visibility: hidden;
}
.carousel-item:hover .p-multiselect {
    visibility: visible;
}


</style>