<template>
	<div class="discover-container">
		<div class="discover-head">
			<h1 class="">{{ props.title }}</h1>
			<slot name="description"></slot>
		</div>
		<div class="discover-content">
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
	</div>
</template>

<script setup>

import { ref } from 'vue';
import BookDiscover from './BookDiscover.vue';

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

.discover-head {
    /*margin-left: calc(var(--p-carousel-content-gap) + 38px);*/
    margin-bottom: 20px;
}
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

</style>