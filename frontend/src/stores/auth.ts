import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, type User } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value)

    // Initialize auth state from localStorage
    const initAuth = () => {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('user_data')

        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
        }
    }

    // Actions
    const login = async (email: string, password: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await authAPI.login(email, password)

            if (response.success) {
                user.value = response.data.user
                token.value = response.data.token

                // Store in localStorage
                localStorage.setItem('auth_token', response.data.token)
                localStorage.setItem('user_data', JSON.stringify(response.data.user))

                return { success: true, message: response.message }
            } else {
                throw new Error('Login failed')
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Error al iniciar sesión'
            error.value = errorMessage
            return { success: false, error: errorMessage }
        } finally {
            loading.value = false
        }
    }

    const register = async (email: string, password: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await authAPI.register(email, password)

            if (response.success) {
                user.value = response.data.user
                token.value = response.data.token

                // Store in localStorage
                localStorage.setItem('auth_token', response.data.token)
                localStorage.setItem('user_data', JSON.stringify(response.data.user))

                return { success: true, message: response.message }
            } else {
                throw new Error('Registration failed')
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Error al registrar usuario'
            error.value = errorMessage
            return { success: false, error: errorMessage }
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        loading.value = true

        try {
            await authAPI.logout()
        } catch (err) {
            console.error('Logout API error:', err)
        } finally {
            // Clear local state regardless of API success
            user.value = null
            token.value = null
            error.value = null

            // Clear localStorage
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')

            loading.value = false
        }
    }

    const fetchProfile = async () => {
        if (!token.value) return

        loading.value = true
        try {
            const response = await authAPI.getProfile()
            if (response.success && response.data) {
                user.value = response.data.user
                localStorage.setItem('user_data', JSON.stringify(response.data.user))
            }
        } catch (err: any) {
            console.error('Failed to fetch profile:', err)
            // If token is invalid, logout
            if (err.response?.status === 401) {
                await logout()
            }
        } finally {
            loading.value = false
        }
    }

    const clearError = () => {
        error.value = null
    }

    return {
        // State
        user,
        token,
        loading,
        error,

        // Getters
        isAuthenticated,

        // Actions
        initAuth,
        login,
        register,
        logout,
        fetchProfile,
        clearError
    }
})
