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
						<div class="carousel-item">
							<Skeleton v-if="!slotProps.data.cover_uri" width="200px" height="333px"></Skeleton>
							<img v-else :src="slotProps.data.cover_uri" @error="console.log('NO IMAGE', slotProps.data.olid)" >
							<div class="carousel-item-desc">
								<p class="book-authors">{{ slotProps.data.authors?.join(',') }}</p>
								<p class="book-title">{{ slotProps.data.title }}</p>
							</div>
						</div>
					</div>
				</template>
			</Carousel>
			<div v-else>Add some books to the list and they'll show up here!</div>
		</div>
	</div>
</template>

<script setup>

import { ref } from 'vue';

const props = defineProps({
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
.carousel-item {
    width: 150px;
    height: 250px;
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 5px;
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
    justify-content: center;
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
}
.book-authors {
    font-size: 14px;
}

</style>