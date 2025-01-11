<template>
    <div class="book">
        <img v-if="props.coverURI" :src="props.coverURI" class="image" alt="img">
        <Skeleton v-else width="150px" height="200px"></Skeleton>
        <div class="book-info">
            <h2>{{ props.title }}</h2>
            <h3>{{ Array.isArray(props.authorNames) ? props.authorNames.join(", ") : props.authorNames }}</h3>
            <p>{{ props.publicationYear }}</p>
            <div class="review">
                <span>--</span>
                <font-awesome-icon icon="star" class="icon star" />
            </div>
        </div>
        <div class="options">
            <MultiSelect v-model="selectedLists" @before-hide="updateLists()" :options="userStore.lists"
                optionLabel="name" placeholder="Add to lists" :disabled="storing ? true : false" />
        </div>
    </div>
</template>

<!-- <template>
    <div class="book">
        <img :src="props.coverURI" class="image" alt="img">
        <h2>{{ props.name }}</h2>
        <p class="description">
            {{ props.description }}
        </p>
        <font-awesome-icon icon="trash" class="icon trash" size="lg" />
        <div class="review">
            <span>{{ props.review }} </span>
            <font-awesome-icon icon="star" class="icon star" />
        </div>
    </div>
</template> -->

<script setup>

import { computed, onBeforeMount, ref } from 'vue';
import axios from 'axios';
import MultiSelect from 'primevue/multiselect';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const selectedLists = ref(null);
const storing = ref(false);
const cond = computed(() => {

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

const props = defineProps({
    olid: String,
    coverURI: String,
    authorNames: [Array, String],
    title: String,
    publicationYear: Number,
})

// console.log(props.coverURI)

</script>

<style scoped>
.book {
    display: grid;
    grid-template-columns: 150px 1fr auto;
    grid-template-rows: 1fr;
    gap: 20px;
    background-color: #EEDC98;
    padding: 13px;
    border-radius: 5px;
    margin-bottom: 20px;
}

h3 {
    font-style: italic;
}

.review {
    display: flex;
    align-items: center;
    gap: 5px;
    direction: flex;
    align-items: center;
}

.star {
    color: var(--gold);
}

.image {
    width: auto;
    max-height: 200px;
    object-fit: contain;
    /* Ensures the aspect ratio is maintained */
}
</style>