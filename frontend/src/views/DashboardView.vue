<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ authStore.user?.email }}</span>
            <button
              @click="handleLogout"
              :disabled="authStore.loading"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <!-- Loading state -->
          <div v-if="authStore.loading" class="text-center">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando...</p>
          </div>

          <!-- Welcome message -->
          <div v-else-if="authStore.user" class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              ¡Bienvenido al Dashboard!
            </h2>
            <div class="max-w-md mx-auto bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Información del Usuario
              </h3>
              <div class="space-y-3 text-left">
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium">{{ authStore.user.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">ID:</span>
                  <span class="font-mono text-sm">{{ authStore.user.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Registered:</span>
                  <span class="text-sm">{{ formatDate(authStore.user.created_at) }}</span>
                </div>
                <div v-if="authStore.user.updated_at" class="flex justify-between">
                  <span class="text-gray-600">Updated:</span>
                  <span class="text-sm">{{ formatDate(authStore.user.updated_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                @click="refreshProfile"
                :disabled="refreshing"
                class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <span v-if="refreshing" class="spinner mr-2"></span>
                {{ refreshing ? 'Actualizando...' : 'Actualizar Perfil' }}
              </button>
              <router-link
                to="/"
                class="w-full sm:w-auto inline-flex justify-center bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Volver al Inicio
              </router-link>
            </div>
          </div>

          <!-- Error state -->
          <div v-else class="text-center text-red-600">
            <p>Error: No se pudo cargar la información del usuario</p>
            <button
              @click="refreshProfile"
              class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const refreshing = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const refreshProfile = async () => {
  refreshing.value = true
  await authStore.fetchProfile()
  refreshing.value = false
}

onMounted(async () => {
  // Initialize auth state
  authStore.initAuth()
  
  // If authenticated, fetch latest profile data
  if (authStore.isAuthenticated) {
    await authStore.fetchProfile()
  }
})
</script>
