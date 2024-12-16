<template>
    <main>
        <div class="grid-item sidebar">
            <Sidebar />
            <!-- <div class="vertical-hr" /> -->
        </div>
        <div class="grid-item navbar" >
            <Navbar />
            <!-- NAVBAR -->
        </div>
        <div class="grid-item view" >
            <router-view />
            <!-- VIEW -->
        </div>
        <div class="grid-item right">
            <!-- Right section -->
        </div>
    </main>
</template>

<script setup>

import Sidebar from '../components/Sidebar.vue';
import { useUserStore } from '../../store/user';

import { onBeforeMount, ref } from 'vue';
import axios from 'axios';

const userStore = useUserStore();

onBeforeMount(async () => {

    // Get default user
    try {
        const response = await axios.get('http://localhost:6543/user');
        console.log(response.data);
        const defaultUser = response.data[0];
        userStore.id = defaultUser.id;
        userStore.username = defaultUser.username;
        userStore.email = defaultUser.email;
        userStore.password = defaultUser.password;
        userStore.visible = defaultUser.visible;
        console.log("Logged in as: ", userStore.$state)
    } catch (error) {
        console.log("Fetch user error", error);
    }

    // Get current user lists
    try {
        const response = await axios.get('http://localhost:6543/book/lists');
        userStore.lists = response.data.filter((list) => list.id_user === userStore.id); // Filter out other users' lists
        console.log("Fetched user's lists: ", userStore.lists);
    } catch (error) {
        console.log("Fetch user lists error", error);
    }
});

</script>

<style scoped>
main {
    height: 100dvh;
    width: 100%;
    display: grid;
    grid-template-columns: 250px 1fr 150px;
    grid-template-rows: 80px 1fr;
}

.sidebar {
    display: flex;
    width: 100%;
    grid-column: 1;
    grid-row: 1 / 3;
}

.vertical-hr {
    width: 1px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    margin: 0 auto;
}

.navbar {
    grid-column: 2 / 4;
}

.view {
    overflow: hidden;
    grid-column: 2;
    grid-row: 2;

    padding: 26px;
}

.right {
    grid-column: 3;
    grid-row: 2 / 3;
}
</style>