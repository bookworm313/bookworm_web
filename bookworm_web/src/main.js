// Application configuration
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

// PrimeVue konfiguracija
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';

// Pinia konfiguracija
import { createPinia } from 'pinia'

// Font Awesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

const app = createApp(App);
const pinia = createPinia()

app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'app-light',
        },
        ripple: true
    }
});
app.use(pinia);
app.use(router);
app.use(ToastService);

// Font Awesome icons
library.add(fas, far, fab);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');