import type {
    User,
    LoginCredentials,
    RegisterCredentials
} from '../types/authentification'
import { getData, removeData, storeData } from './helper'
import { getResource, postResource } from './api'

export const useAuthService = () => {
    function isAuthenticated(): boolean {
        const token = getData("auth_token")
        return token !== null && token !== undefined && token !== ''
    }

    async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        try {
            const response = await postResource<{ user: User; token: string }>(
                '/auth/login',
                credentials
            )

            console.log(response.data)
            const { user, token } = response.data

            // Stocker le token automatiquement
            storeData("auth_token", token)

            return { user, token }
        } catch (error) {
            console.error('[AUTH] Erreur lors de la connexion :', error)
            throw error
        }
    }

    async function register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
        try {
            const response = await postResource<{ user: User; token: string }>(
                '/auth/register',
                credentials
            )

            const { user, token } = response.data

            // Stocker le token automatiquement
            storeData("auth_token", token)

            return { user, token }
        } catch (error) {
            console.error('[AUTH] Erreur lors de l\'inscription :', error)
            throw error
        }
    }

    async function logout(): Promise<void> {
        removeData('auth_token')
    }

    async function getCurrentUser(): Promise<User> {
        try {
            const response = await getResource<{ user: User }>('/auth/profile')
            return response.data.user
        } catch (error) {
            throw error
        }
    }

    async function validateToken(): Promise<boolean> {
        try {
            await getCurrentUser()
            return true
        } catch (error) {
            removeData("auth_token")
            return false
        }
    }

    return {
        isAuthenticated,
        login,
        register,
        logout,
        getCurrentUser,
        validateToken
    }
}