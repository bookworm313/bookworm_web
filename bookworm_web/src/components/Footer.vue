<template>
    <div class="footer">
        <font-awesome-icon icon="user" />
        <h1>Hello, {{ name }}</h1>
    </div>
</template>

<script setup>
import { useUserStore } from '../../store/user'
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';

const userStore = useUserStore()

const name = computed(() => userStore.fullName); // computed varijablu se može samo čitat, ne mijenjat
onMounted(() => {
    console.log('Footer component mounted');
});
</script>

<style scoped>
.footer {
    text-align: center;
    padding: 10px;
    background-color: #f8f9fa;
    color: black;
}
</style>