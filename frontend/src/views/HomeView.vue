<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenido a Vue Login App
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Una aplicación de autenticación personalizada con Vue.js y Express.js
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <div v-if="authStore.isAuthenticated" class="text-center">
          <p class="text-lg text-gray-700 mb-4">
            ¡Hola, {{ authStore.user?.email }}!
          </p>
          <div class="space-y-3">
            <router-link 
              to="/dashboard" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ir al Dashboard
            </router-link>
            <button 
              @click="handleLogout"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <router-link 
            to="/login" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Iniciar Sesión
          </router-link>
          <router-link 
            to="/register" 
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Registrarse
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(() => {
  // Initialize auth state when component mounts
  authStore.initAuth()
})
</script>
