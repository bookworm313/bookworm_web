<template>
	<div class="discover-container">
		<div class="discover-head">
			<Skeleton v-if="props.loadingBooks" width="500px" height="48px"></Skeleton>
			<h1 v-else>{{ props.title }}</h1>
			<Skeleton v-if="props.loadingBooks" width="500px" height="24px"></Skeleton>
			<slot v-else v-if="props.books.length > 0" name="description"></slot>
		</div>

		<Skeleton v-if="props.loadingBooks" width="100%" height="250px"></Skeleton>
		<div v-else class="discover-content">
			<Carousel v-if="props.loadingBooks || props.books.length > 0" :value="props.books" :num-visible="8" :numScroll="1" :showIndicators="false" >
				<template #item="slotProps" :empty="" >
					<div class="carousel-item-container">
						<!--<div class="carousel-item">
							<Skeleton v-if="!slotProps.data.cover_uri" width="200px" height="333px"></Skeleton>
							<img v-else :src="slotProps.data.cover_uri" @error="console.log('NO IMAGE', slotProps.data.olid)" >
							<div class="carousel-item-desc">
								<p class="book-authors">{{ slotProps.data.authors?.join(',') }}</p>
								<p class="book-title">{{ slotProps.data.title }}</p>
							</div>
						</div>-->
                        <BookDiscover :is-new="props.isNew" :book-data="slotProps.data"/>
					</div>
				</template>
			</Carousel>
			<div v-else>Add some books to the list and they'll show up here!</div>
		</div>
		<slot v-if="!props.loadingBooks" name="genre-desc"></slot>
	</div>
</template>

<script setup>

import { ref } from 'vue';
import BookDiscover from './BookDiscover.vue';
import { Skeleton } from 'primevue';

const props = defineProps({
    isNew: Boolean,
	title: String,
	loadingBooks: Boolean,
	books: Array,
})

const noImage = ref(false);

// TODO: dodaj watch koji prati noImage -> kad se promini treba prominit stil na opisu

</script>

<style scoped>

.discover-head p {
    font-style: italic;
}

.link {
    text-decoration: none;
    font-style: normal;
    color: #B60000;
}
.link:hover {
    text-decoration: underline;
}
.link:visited {
    color: #B60000;
}

.discover-container {
    margin-bottom: 26px;
    background-color: #ecdeaa;
    padding: 26px;
    border-radius: 5px;
}

:deep(.p-carousel .p-carousel-item)  {
  flex: 0 0 12.5% !important; 
}
.carousel-item-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.discover-content {
    margin: 20px 0;
}

.p-skeleton {
	background-color: var(--bg);
	margin-bottom: 10px;
}

</style>