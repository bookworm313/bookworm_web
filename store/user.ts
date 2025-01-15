import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        id: 0,
        username: '',
        email: '',
        password: '',
        visible: true,
        lists: [{
            id: 0,
            name: '',
            is_default: true,
            visible: true,
            books_olid: '',
        }],
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
        //fullName: (state) => `${state.name} ${state.surname}`,
    },
});
