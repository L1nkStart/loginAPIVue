import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export interface User {
    id: string
    email: string
    created_at: string
    updated_at?: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data: {
        user: User
        token: string
    }
}

export interface ApiResponse<T> {
    success: boolean
    message?: string
    data?: T
    error?: string
    details?: any[]
}

// Auth API calls
export const authAPI = {
    register: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', { email, password })
        return response.data
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    logout: async (): Promise<ApiResponse<null>> => {
        const response = await api.post('/auth/logout')
        return response.data
    },

    getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
        const response = await api.get('/auth/profile')
        return response.data
    }
}

export default api
