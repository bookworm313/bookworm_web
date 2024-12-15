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