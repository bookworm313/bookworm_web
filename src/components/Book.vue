<template>
    <div class="book">
        <div class="cover-container">
            <img :src="props.coverUri" class="image" alt="No Cover" />
        </div>
        <div class="desc-container">
            <h3 class="authors">{{ props.authorNames?.join(", ") }} ({{ props.publishYear }})</h3>
            <h2 class="title">{{ props.title }}</h2>
            <h3 class="subtitle">{{ props.subtitle }}</h3>
        </div>
        <!-- <div class="progress"></div> -->
        <div>
            <font-awesome-icon icon="trash" class="icon trash" size="lg" />
        </div>
        <!--<div class="review">
            <span>{{ props.review }} </span>
            <font-awesome-icon icon="star" class="icon star" />
            <MultiSelect v-model="selectedLists" @before-hide="updateLists()" :options="userStore.lists"
                optionLabel="name" placeholder="Add to lists" :disabled="storing ? true : false" />
        </div>-->
    </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import axios from 'axios';
import MultiSelect from 'primevue/multiselect';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const selectedLists = ref(null);
const storing = ref(false);

const coverLoaded = ref(true);
function coverNotFound() {
    coverLoaded.value = false;
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


onBeforeMount(() => {
    selectedLists.value = userStore.lists.filter((list) => {
        //console.log(list + " includes " + props.olid + ": " + list.books_olid.split(",").includes(props.olid))
        return list.books_olid.split(",").includes(props.olid)
    });
})

async function updateLists() {
    console.log("enter");

    // userStore.lists.length
    for (let i = 0; i < userStore.lists.length; i++) {
        const list = userStore.lists[i];

        const correspondingSelected = selectedLists.value.find((selectedList) => list.id === selectedList.id)
        console.log("corr", list, correspondingSelected)

        let newOlid = "";

        if (list.books_olid.includes(props.olid)) {
            // List was previously selected

            if (correspondingSelected) {
                // List is still selected
                newOlid = list.books_olid;
                console.log(1)
            }
            else {
                // List is no longer selected
                newOlid = list.books_olid.replace(`${props.olid},`, '');
                console.log(2)
            }
        }
        else {
            // List wasn't selected previously

            if (correspondingSelected) {
                // List is now selected
                newOlid = list.books_olid.concat(`${props.olid},`);
                console.log(3)
            }
            else {
                // List is still not selected
                newOlid = list.books_olid;
                console.log(4)
            }
        }

        const payload = {
            list_id: list.id,
            books_olid: newOlid,
        };

        console.log(list.name + ": prev olid: " + list.books_olid);
        console.log(list.name + ": new olid: " + newOlid);
        userStore.lists[i].books_olid = payload.books_olid;
        console.log("hm", list.name, list.books_olid)

        try {
            storing.value = true;
            const response = await axios.post('http://localhost:8080/book', payload);
            storing.value = false;
            console.log('Response: ', response.data);
        } catch (error) {
            console.log('Error: ', error.response?.data || error.message);
        }
    }

    console.log("exit")
}


</script>

<style scoped>
.book {
    max-width: 1000px;
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

</style>