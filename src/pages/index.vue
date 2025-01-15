<template>
    <main>
        <div class="grid-item sidebar">
            <Sidebar />
            <!-- <div class="vertical-hr" /> -->
        </div>
        <div class="grid-item navbar">
            <Navbar />
            <!-- NAVBAR -->
        </div>
        <div class="grid-item view">
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

import { onBeforeMount, ref } from 'vue';
import axios from 'axios';

</script>

<style scoped>
main {
    position: relative;
    min-height: 100dvh;
    width: 100%;
    display: grid;
    grid-template-columns: 250px 1fr 150px;
    grid-template-rows: 80px 1fr;
    overflow: hidden;
}

.sidebar {
    display: flex;
    width: 250px;
    grid-column: 1;
    grid-row: 1 / 3;

    position: fixed;
    top: 0;
    height: 100%;
    overflow-y: auto;
}

.vertical-hr {
    width: 1px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    margin: 0 auto;
}

.navbar {
    grid-column: 2 / 4;
    width: 100%;
    /* position: fixed;
    right: 0;
    top: 0;
    z-index: 10; */
    /* Ensure it stays above other content */
}

.view {
    overflow-y: auto;
    /* Enable scrolling within this section */
    grid-column: 2;
    grid-row: 2;
    border-radius: 10px;
    padding: 26px;
}

.right {
    grid-column: 3;
    grid-row: 2 / 3;
}
</style>