import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        name: 'John',
        surname: 'Smith',
        age: 30,
        email: 'john.smith@example.com',
        isLoggedIn: false,
    }),
    actions: {
        login() {
            this.isLoggedIn = true;
        },
        logout() {
            this.isLoggedIn = false;
        },
        setAge(value: number) {
            this.age = value;
        }
    },
    getters: {
        fullName: (state) => `${state.name} ${state.surname}`,
    },
});
