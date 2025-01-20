<template>
    <div class="auth-container">
        <h2 class="auth-title">{{ isLogin ? "Login" : "Signup" }}</h2>

        <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="input-group">
                <label for="username">Username or Email:</label>
                <input v-model="formData.usernameOrEmail" type="text" id="username"
                    placeholder="Enter your username or email" required />
            </div>

            <div v-if="!isLogin" class="input-group">
                <label for="email">Email:</label>
                <input v-model="formData.email" type="email" id="email" placeholder="Enter your email" required />
            </div>

            <div class="input-group">
                <label for="password">Password:</label>
                <input v-model="formData.password" type="password" id="password" placeholder="Enter your password"
                    required />
            </div>

            <button type="submit" class="auth-button">
                {{ isLogin ? "Login" : "Signup" }}
            </button>
        </form>

        <p class="auth-toggle">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <span @click="toggleMode" class="toggle-link">
                {{ isLogin ? "Signup" : "Login" }}
            </span>
        </p>

        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { login, signup } from "../../services/serverApi";
import { useUserStore } from '../../store/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const isLogin = ref(true);
const formData = ref({
    usernameOrEmail: "",
    email: "",
    password: "",
});
const error = ref(null);

const handleSubmit = async () => {
    try {
        error.value = null;

        if (isLogin.value) {
            const response = await login({
                username: formData.value.usernameOrEmail,
                email: formData.value.usernameOrEmail,
                password: formData.value.password,
            });
            const user = await response?.user;
            console.log(user);
            //save to local storage

            localStorage.setItem("user", JSON.stringify(user));

            router.push({ path: "/" });
        } else {
            const response = await signup({
                username: formData.value.usernameOrEmail,
                email: formData.value.email,
                password: formData.value.password,
            });
            alert(response.message);
        }
    } catch (err) {
        error.value = err.message;
    }
};

const toggleMode = () => {
    isLogin.value = !isLogin.value;
    formData.value = {
        usernameOrEmail: "",
        email: "",
        password: "",
    };
    error.value = null;
};
</script>


<style scoped>
.auth-container {
    width: 350px;
    margin: 2em auto;
    padding: 2em;
    border-radius: 8px;
    background-color: #f4f7fa;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.auth-title {
    font-size: 24px;
    margin-bottom: 1.5em;
    color: #333;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.input-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 0.5em;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s;
}

input:focus {
    border-color: #007bff;
}

.auth-button {
    padding: 12px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.auth-button:hover {
    background-color: #0056b3;
}

.auth-toggle {
    font-size: 14px;
    margin-top: 1em;
}

.toggle-link {
    color: #007bff;
    cursor: pointer;
    font-weight: bold;
}

.error {
    color: red;
    font-size: 14px;
    margin-top: 1em;
}
</style>