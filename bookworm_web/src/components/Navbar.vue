<template>
    <section>
        <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="search" placeholder="Search books, authors, etc." />
        </IconField>
        <div class="icons">
            <font-awesome-icon class="icon" icon="user-gear" size="lg" />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

const search = ref(null)
</script>

<style scoped>
section {
    height: 100%;
    padding: 26px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: var(--primary);
}

.icon:hover {
    transform: scale(1.05);
    cursor: pointer;
}

.icon:active {
    transform: scale(0.95);
}
</style>