<template>
    <div class="main">
        <Toast />
        <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit"
            class="container">
            <div class="flex flex-col gap-1">
                <InputNumber name="amount" v-model="amount" fluid />
                <Message v-if="$form.amount?.invalid" severity="error" size="small" variant="simple">{{
                    $form.amount.error?.message }}</Message>
            </div>
            <Button type="submit" severity="secondary" label="Submit" />
        </Form>
        <div class="container down">
            <h1>Ime i prezime korisnika: {{ name }}</h1>
            <h1>Godine korisnika: <u>{{ userStore.age }}</u></h1>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '../../../store/user'
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
// Za validaciju forme
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

const userStore = useUserStore()

const toast = useToast();

// Kompjutirani podaci o korisniku
const name = computed(() => userStore.fullName);

// Form data
const amount = ref(5); // Amount je sada reaktivno povezano sa inputom

const initialValues = ref({
    amount: 5
});

const resolver = ref(zodResolver(
    z.object({
        amount: z.union([z.number().gt(0, { message: 'Must be greater than 0.' }), z.literal(null)]).refine((val) => val !== null, { message: 'Number is required.' })
    })
));

// Funkcija za obradu submit-a
const onFormSubmit = ({ valid }) => {
    if (valid) {
        // Ažuriraj godine korisnika u store-u
        userStore.age = amount.value; // Spremi u store

        toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 });
    }
};
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
}

u {
    color: rgb(238, 255, 0);
}
</style>
