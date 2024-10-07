<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const fullName = ref('');
const isLogin = ref(true);

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const handleSubmit = async () => {
  try {
    let response;
    if (isLogin.value) {
      response = await axios.post('http://localhost:3000/login', {
        email: email.value,
        password: password.value
      });
      localStorage.setItem('token', response.data.token);
      router.push('/home');
    } else {
      response = await axios.post('http://localhost:3000/register', {
        fullName: fullName.value,
        email: email.value,
        password: password.value
      });
      email.value = '';
      password.value = '';
      fullName.value = '';
      isLogin.value = true;
    //   handleSubmit();
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.response.data.message || 'Terjadi kesalahan');
  }
};

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/home');
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 mx-auto">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-3xl font-bold mb-6 text-center">{{ isLogin ? 'Masuk' : 'Daftar' }}</h1>
      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="mb-4">
          <label for="fullName" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input v-model="fullName" type="text" id="fullName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Kata Sandi</label>
          <input v-model="password" type="password" id="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {{ isLogin ? 'Masuk' : 'Daftar' }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }}
        <a @click="toggleForm" class="text-indigo-600 hover:text-indigo-500 cursor-pointer">
          {{ isLogin ? 'Daftar' : 'Masuk' }}
        </a>
      </p>
    </div>
  </div>
</template>
