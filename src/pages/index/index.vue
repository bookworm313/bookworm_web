<template>
    <div class="main">
        <h1>Discover</h1>
        <hr>
        <div class="discover">
            <div class="discover-container">
                <div class="discover-head">
                    <h1 class="">Up next...</h1>
                    <p>From your <RouterLink class="link" to="/lists#want_to_read">&nbsp;<font-awesome-icon :icon="'book-bookmark'" /> Want To Read</RouterLink> list</p>
                </div>
                <div class="discover-content">
                    <Carousel v-if="loadingBooks || toReadBooks.length > 0" :value="toReadBooks" :num-visible="8" :numScroll="1" :showIndicators="false" >
                        <template #item="slotProps" :empty="" >
                            <div class="carousel-item-container">
                                <div class="carousel-item">
                                    <Skeleton v-if="!slotProps.data.cover_uri" width="200px" height="333px"></Skeleton>
                                    <img v-else :src="slotProps.data.cover_uri" >
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
            <div class="discover-container">
                <div class="discover-head">
                    <h1 class="">You might like these</h1>
                    <p>Generated recommendations based on your <RouterLink class="link" to="/lists#done_reading">&nbsp;<font-awesome-icon :icon="'book-open'" /> Done Reading</RouterLink> list</p>
                </div>
                <div class="discover-content">
                    <div v-if="recommendedBooks">
                        <p v-for="recBook in recommendedBooks">
                            {{ recBook.title }} by {{ recBook.authors }}
                        </p>
                    </div>
                    <div v-else>Add some books to the list and they'll show up here!</div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
const loggedInUserId = 1;

import Skeleton from 'primevue/skeleton';
import Carousel from 'primevue/carousel';

import { onBeforeMount, ref } from 'vue';
import { getWantToRead } from '../../../services/serverApi';
import { fetchBooksByOLID } from '../../utils/openlibrary';
import { generateRecommendations } from '../../../services/groqService';

const toReadBooks = ref([{},{},{},{},{},{},{},{}]);
const recommendedBooks = ref("");
const loadingBooks = ref(true);

onBeforeMount(async () => {

    loadingBooks.value = true;
    const toReadList = await getWantToRead(loggedInUserId);
    const bookIds = toReadList.booksOlid;
    console.log(bookIds)
    try {
        toReadBooks.value = await fetchBooksByOLID(bookIds);
        console.log("Dohvaćene knjige: ", toReadBooks.value);
    } catch (error) {
        console.error("Greška kod dohvaćanja knjiga: ", error);
    }

    recommendedBooks.value = await generateRecommendations(loggedInUserId);
    recommendedBooks.value = recommendedBooks.value.split("###");
    recommendedBooks.value.pop(); // jer i zadnji element završi na ### pa će ostat prazni element na kraju
    for (let i = 0; i < recommendedBooks.value.length; i++) {
        recommendedBooks.value[i] = {
            title: recommendedBooks.value[i].split(";;;")[0],
            authors: recommendedBooks.value[i].split(";;;")[1]
        }
    }
    console.log(recommendedBooks.value)

    loadingBooks.value = false;
});

/*const responsiveOptions = ref([
  {
    breakpoint: '1200px', // do 1100px je vidljivo 3
    numVisible: 2,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '1400px',
    numVisible: 3,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '1600px',
    numVisible: 4,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '1800px',
    numVisible: 5,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '2000px',
    numVisible: 6,
    numScroll: 1,
    showNavigators: false
  },
])*/



</script>

<style scoped>

hr {
    margin: 13px 0;
}

h2 {
    font-size: 1.5em;
}

.discover {
    padding: 20px;
}

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
