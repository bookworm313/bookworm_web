<template>
    <div class="book" v-if="!isRemoved">
        <div class="cover-container">
            <img v-if="props.coverUri" :src="props.coverUri" class="image" alt="No Cover" @click="showBookInfo()" />
            <Skeleton v-else size="5rem"></Skeleton>
        </div>
        <div class="desc-container">
            <h3 class="authors">{{ props.authorNames?.join(", ") }} ({{ props.publishYear }})</h3>
            <h2 class="title">{{ props.title }}</h2>
            <h3 class="subtitle">{{ props.subtitle }}</h3>
            <!-- Rating Stars v-if="isPageDoneReading" -->
            <div class="rating">
                <div v-if="!isPageDoneReading && currentReview === 0">
                    No reviews found
                </div>
                <font-awesome-icon v-else v-for="n in 5" :key="n" :icon="[n <= currentReview ? 'fas' : 'far', 'star']"
                    class="icon star" @click="isPageDoneReading ? toggleReview(n) : ''" />
            </div>
        </div>

        <!-- <div class="progress"></div> -->
        <div>
            <font-awesome-icon icon="trash" class="icon trash" size="lg"
                @click="removeFromList(props.listId, props.olid)" />
        </div>
        <!--<div class="review">
            <span>{{ props.review }} </span>
            <font-awesome-icon icon="star" class="icon star" />
            <MultiSelect v-model="selectedLists" @before-hide="updateLists()" :options="userStore.lists"
                optionLabel="name" placeholder="Add to lists" :disabled="storing ? true : false" />
        </div>-->
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
                <div class="rating">
                    <font-awesome-icon v-for="n in 5" :key="n" :icon="[n <= currentReview ? 'fas' : 'far', 'star']"
                        class="icon star" @click="isPageDoneReading ? toggleReview(n) : ''" />
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
const loggedInUserId = 1;

import { onBeforeMount, ref, onMounted, defineProps, watch } from 'vue';
import { useUserStore } from '../../store/user';
import { Skeleton } from 'primevue';
import { removeBookFromList } from '../../services/serverApi';
import { fetchBook } from '../utils/openlibrary';

const userStore = useUserStore();
const selectedLists = ref(null);
const storing = ref(false);

const isRemoved = ref(false);

const isPageDoneReading = ref(false);

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
    review: {
        type: Number,
        default: 0,
    },
})

// Lokalna varijabla za pohranu trenutne ocjene
const currentReview = ref(0);

// Praćenje promjena u props.review
watch(() => props.review, (newValue) => {
    currentReview.value = newValue;  // Ažurirajte lokalnu ocjenu kad se promijeni review
});

const toggleReview = (value) => {
    if (currentReview.value === value) {
        // Ako je već odabrano, resetiraj ocjenu
        currentReview.value = 0;
        console.log('Ocjena uklonjena');
    } else {
        // Postavi novu ocjenu
        currentReview.value = value;
        console.log(`Odabrana ocjena: ${value}`);
    }
    try {
        const url = 'http://localhost:3000/review';
        const user = JSON.parse(localStorage.getItem("user"))
        const data = {
            bookOlid: props.olid,
            review: currentReview.value,
            userId: user?.id
        }
        console.log(data);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }
};

onBeforeMount(() => {
    selectedLists.value = userStore.lists.filter((list) => {
        //console.log(list + " includes " + props.olid + ": " + list.books_olid.split(",").includes(props.olid))
        return list.books_olid.split(",").includes(props.olid)
    });
})

onMounted(async () => {
    //check if the # in url is '#done_reading' and set isPageDoneReading to true
    if (window.location.hash == "#done_reading") {
        isPageDoneReading.value = true;
    }
    try {
        const user = JSON.parse(localStorage.getItem("user"))
        console.log("OLID: ", props.olid)
        console.log("USER: ", user?.id)
        const url = 'http://localhost:3000/review/' + props.olid + '/' + user?.id;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data[0]?.stars) { currentReview.value = data[0].stars; }
    } catch (error) {
        console.error(error);
    }


})

async function removeFromList(listId, olid) {
    await removeBookFromList(loggedInUserId, listId, olid);
    isRemoved.value = true;
}

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

.desc-container {}

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

.descr {
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