<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const todos = ref([]);
const categories = ref([]);
const user = ref([]);
const selectedCategory = ref('all');
const isSidebarOpen = ref(false);
const isModalOpen = ref(false);
const isModalCategoryOpen = ref(false);
const newTask = ref({
  title: '',
  description: '',
  dueDate: '',
  CategoryId: ''
});
const newCategory = ref({
  name: ''
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const fetchUser = async () => {
  try {
    const response = await axios.get('https://tdlsrvr.vercel.app/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log('user',response.data);
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const fetchTodos = async (status = '') => {
  try {
    const response = await axios.get(`https://tdlsrvr.vercel.app/todos?status=${status}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log(response.data);
    todos.value = response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get('https://tdlsrvr.vercel.app/categories', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const filteredTodos = computed(() => {
  if (selectedCategory.value === 'all') {
    return todos.value;
  }
  return todos.value.filter(todo => todo.CategoryId === selectedCategory.value);
});

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'done': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'done': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const markAsDone = async (id) => {
  try {
    await axios.put(`https://tdlsrvr.vercel.app/todos/${id}`, { status: 'done' }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    await fetchTodos();
  } catch (error) {
    console.error('Error marking todo as done:', error);
  }
};

const deleteTodo = async (id) => {
  try {
    await axios.delete(`https://tdlsrvr.vercel.app/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    await fetchTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

const openModal = () => {
  isModalOpen.value = true;
};
const openModalCategory = () => {
  isModalCategoryOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
const closeModalCategory = () => {
  isModalCategoryOpen.value = false;
};

const addTask = async () => {
  try {
    const response = await axios.post('https://tdlsrvr.vercel.app/todos', newTask.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log('Tugas baru ditambahkan:', response.data);
    await fetchTodos();
    closeModal();
    // Reset form
    newTask.value = {
      title: '',
      description: '',
      dueDate: '',
      CategoryId: ''
    };
  } catch (error) {
    console.error('Error menambahkan tugas:', error);
  }
};

const addCategory = async () => {
  try {
    const response = await axios.post('https://tdlsrvr.vercel.app/categories', newCategory.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    closeModalCategory();
    await fetchCategories();

  } catch (error) {
    console.error('Error menambahkan kategori:', error);
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

onMounted(() => {
  fetchTodos();
  fetchCategories();
  fetchUser();
});
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-100 w-full">
    <!-- Sidebar/Navbar -->
    <div :class="['bg-white border-r transition-all duration-300 ease-in-out border-b-2 h-full', isSidebarOpen ? 'w-full' : 'w-full md:w-64 ']">
      <div class="h-16 flex items-center justify-between px-4 border-b">
        <h1 :class="['text-xl font-semibold text-gray-800', isSidebarOpen ? '' : 'hidden md:block']">{{ user.fullName }}</h1>
        <button @click="toggleSidebar" class="text-gray-600 hover:text-gray-800 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div :class="['p-4', isSidebarOpen ? '' : 'hidden md:block']">
        <button @click="openModal" class="w-full bg-red-500 text-white rounded-md py-2 px-4 mb-4">Tambah Tugas</button>
      </div>
      <div :class="['p-4', isSidebarOpen ? '' : 'hidden md:block']">
        <button @click="openModalCategory" class="w-full bg-red-500 text-white rounded-md py-2 px-4 mb-4">Tambah Kategori</button>
      </div>
      <nav :class="['space-y-1', isSidebarOpen ? '' : 'hidden md:block']">
        <a href="#" @click="fetchTodos('')" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          All
        </a>
        <a href="#" @click="fetchTodos('pending')" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Pending
        </a> 
        <a href="#" @click="fetchTodos('done')" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Completed
        </a>
        <button @click="logout" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 mt-4 text-red-500">
          Log Out
        </button>
      </nav>
    </div>

    <!-- Main content area -->
    <div class="flex-1 bg-white p-4">
      <h1 class="text-2xl font-semibold mb-4">Welcome to your To-Do List</h1>
      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 border-b-2">
          <div v-for="todo in filteredTodos" :key="todo.id" class="p-4 rounded-lg shadow-md flex border-b-2 bg-white mb-4 relative">
            <div :class="getStatusColor(todo.status)" class="w-2 h-full absolute left-0 top-0 rounded-l-lg"></div>
            <div class="flex-grow pl-4">
              <div class="flex justify-between items-center mb-2">
                <h2 class="text-lg font-semibold">{{ todo.title }}</h2>
                <span :class="getStatusBadgeColor(todo.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                  {{ todo.status }}
                </span>
              </div>
              <p class="text-gray-600 mb-2">{{ todo.description }}</p>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <p>Tenggat: {{ formatDate(todo.dueDate) }}</p>
                <p>Kategori: {{ todo.Category.name }}</p>
              </div>
            </div>
            <div class="flex flex-col justify-between ml-4">

              <button v-if="todo.status !== 'done'" @click="markAsDone(todo.id)" class="bg-green-500 text-white px-3 py-1 rounded-md mb-2 hover:bg-green-600 transition duration-300">
                Selesai
              </button>

              <button @click="deleteTodo(todo.id)" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300">
                Hapus
              </button>
            </div>
          </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Tambah Tugas Baru</h3>
          <div class="mt-2 px-7 py-3">
            <input v-model="newTask.title" type="text" placeholder="Judul" class="mb-3 px-3 py-2 border rounded-md w-full">
            <textarea v-model="newTask.description" placeholder="Deskripsi" class="mb-3 px-3 py-2 border rounded-md w-full"></textarea>
            <input v-model="newTask.dueDate" type="date" class="mb-3 px-3 py-2 border rounded-md w-full">
            <select v-model="newTask.CategoryId" class="mb-3 px-3 py-2 border rounded-md w-full">
              <option value="">Pilih Kategori</option>
              <option value="1">Any</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="items-center px-4 py-3">
            <button @click="addTask" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
              Tambah
            </button>
            <button @click="closeModal" class="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Category -->
    <div v-if="isModalCategoryOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Tambah Kategori Baru</h3>
          <div class="mt-2 px-7 py-3">
            <input v-model="newCategory.name" type="text" placeholder="Judul" class="mb-3 px-3 py-2 border rounded-md w-full">
          </div>
          <div class="items-center px-4 py-3">
            <button @click="addCategory" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
              Tambah
            </button>
            <button @click="closeModalCategory" class="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .hidden {
    display: none;
  }
}
</style>