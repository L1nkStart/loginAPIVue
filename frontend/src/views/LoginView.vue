<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          O 
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            crear una cuenta nueva
          </router-link>
        </p>
      </div>
      
      <div class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Dirección de email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              @keyup.enter="handleSubmit"
            />
          </div>
        </div>

        <div v-if="authStore.error" class="text-red-600 text-sm text-center">
          {{ authStore.error }}
        </div>

        <div v-if="successMessage" class="text-green-600 text-sm text-center">
          {{ successMessage }}
        </div>

        <div>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="spinner mr-2"></span>
            {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <div class="text-center">
          <router-link 
            to="/" 
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            ← Volver al inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const successMessage = ref('')

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  
  try {
    authStore.clearError()
    successMessage.value = ''

    const result = await authStore.login(form.value.email, form.value.password)
    
    if (result.success) {
      successMessage.value = result.message || 'Login exitoso'
      // Redirect after successful login
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }else {
      alert('NEGATIVO COMPA')
    }
    

    // Error handling is done in the store and will be displayed via authStore.error
  } catch (error) {
    console.error('Login error:', error)
  }
}

onMounted(() => {
  // Clear any previous errors
  authStore.clearError()
  // Initialize auth state
  authStore.initAuth()
})
</script>
