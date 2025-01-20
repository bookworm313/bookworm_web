<template>
    <div class="main">
        <h1>Discover</h1>
        <hr>
        <div class="discover">
            <DiscoverCategory :is-new="true" :title="`We think you'll like these...`" :loading-books="loadingBooks" :books="recommendedBooksHistory">
                <template v-slot:description>
                    <p>Generated recommendations based on your <RouterLink class="link" to="/lists#done_reading">&nbsp;<font-awesome-icon :icon="'book-open'" /> Done Reading</RouterLink> list</p>
                </template>
            </DiscoverCategory>

            <DiscoverCategory :is-new="true" :title="`A wild genre has appeared!`" :loading-books="loadingBooks" :books="recommendedBooksRandom">
                <template v-slot:description>
                    <p>Discover something new. Here are some <span class="highlight">{{ randomGenre }}</span> books.</p>
                </template>
                <template v-slot:genre-desc>
                    <div class="genre-desc">
                        <font-awesome-icon icon="info-circle" class="genre-desc-icon" />
                        <p>{{ randomGenreDesc }}</p>
                    </div>
                </template>
            </DiscoverCategory>

            <DiscoverCategory :is-new="false" :title="'Up next'" :loading-books="loadingBooks" :books="toReadBooks">
                <template v-slot:description>
                    <p>From your <RouterLink class="link" to="/lists#want_to_read">&nbsp;<font-awesome-icon :icon="'book-bookmark'" /> Want To Read</RouterLink> list</p>
                </template>
            </DiscoverCategory>
        </div>
        
    </div>
</template>

<script setup>

const loggedInUserId = 1;

import DiscoverCategory from '../../components/DiscoverCategory.vue'

import { onBeforeMount, ref } from 'vue';
import { getWantToRead } from '../../../services/serverApi';
import { fetchBooksByOLID, fetchBookByQuery } from '../../utils/openlibrary';
import { generateRecommendationsByHistory, generateRecommendationsRandom } from '../../../services/groqService';

const toReadBooks = ref([{},{},{},{},{},{},{},{}]);
const recommendedBooksHistory = ref([{},{},{},{},{},{},{},{}]);
const recommendedBooksRandom = ref([{},{},{},{},{},{},{},{}]);
const randomGenre = ref("");
const randomGenreDesc = ref("");
const loadingBooks = ref(true);

onBeforeMount(async () => {

    loadingBooks.value = true;
    const toReadList = await getWantToRead(loggedInUserId);

    if (toReadList) {
        const bookIds = toReadList.booksOlid;
        
        try {
            toReadBooks.value = await fetchBooksByOLID(bookIds);
        } catch (error) {
            console.error("Greška kod dohvaćanja knjiga: ", error);
        }
    }

    let recBooksHistory = await generateRecommendationsByHistory(loggedInUserId);
    if (recBooksHistory) {
        recBooksHistory = recBooksHistory.split("###");
        recBooksHistory.pop(); // jer i zadnji element završi na ### pa će ostat prazni element na kraju

        const recBooksTemp = [];
        for (const recBookStr of recBooksHistory) {
            const recBook = await fetchBookByQuery(recBookStr.split(";;;")[0] + " " + recBookStr.split(";;;")[1].split(', ')[0]);
            if (!recBook) continue;
            recBooksTemp.push(recBook);
        }

        recommendedBooksHistory.value = recBooksTemp;
    }

    let recBooksRandom = await generateRecommendationsRandom();
    console.log("INDEX Dobivene preporuke:\n" + recBooksRandom);
    if (recBooksRandom) {
        recBooksRandom = recBooksRandom.split("###");
        const genre = recBooksRandom.shift().split(";;;");
        randomGenre.value = genre[0];
        randomGenreDesc.value = String(genre[1]).charAt(0).toUpperCase() + String(genre[1]).slice(1);
        recBooksRandom.pop();

        const recBooksTemp = [];
        for (const recBookStr of recBooksRandom) {
            const recBook = await fetchBookByQuery(recBookStr.split(";;;")[0] + " " + recBookStr.split(";;;")[1].split(', ')[0]);
            if (!recBook) continue;
            recBooksTemp.push(recBook);
        }

        recommendedBooksRandom.value = recBooksTemp;
    }
    
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

.discover {
    padding: 20px;
}

.discover-head {
    /*margin-left: calc(var(--p-carousel-content-gap) + 38px);*/
    margin-bottom: 20px;
}
.discover-head p {
    
}

.link, .highlight {
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

.genre-desc {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}
.genre-desc-icon {
    margin-top: 4px;
}
.genre-desc p {
    flex-grow: 1;
    font-style: italic;
}

</style>