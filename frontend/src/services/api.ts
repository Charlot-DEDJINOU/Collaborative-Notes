
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { getData } from './helper'

// Récupère l'URL de l'API depuis le .env
const apiUrl = import.meta.env.VITE_API_URI_BASE
if (apiUrl) {
    axios.defaults.baseURL = apiUrl
} else {
    console.warn('[API] VITE_API_URI_BASE non défini')
}

// Intercepteur pour ajouter le token d'authentification
axios.interceptors.request.use(
    async (
        config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {

        const token = getData('auth_token');
        if (typeof token === 'string' && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
            config.headers['Cache-Control'] = 'no-cache'
        }

        return config
    },
    (error) => {
        console.error('[API] Erreur requête :', error)
        return Promise.reject(error)
    }
)

// GET générique
export async function getResource<T = any>(
    resourceUrl: string,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return axios.get<T>(resourceUrl, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        ...config,
    })
}

// POST générique
export async function postResource<T = any>(
    resourceUrl: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return axios.post<T>(resourceUrl, data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        ...config,
    })
}

// POST fichier (FormData)
export async function postFile<T = any>(
    resourceUrl: string,
    formData: FormData,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return axios.post<T>(resourceUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
        },
        ...config,
    })
}

// PUT générique
export async function putResource<T = any>(
    resourceUrl: string,
    id: number | string,
    data: unknown,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return axios.put<T>(`${resourceUrl}/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        ...config,
    })
}

// PATCH générique
export async function patchResource<T = any>(
    resourceUrl: string,
    id: number | string,
    data: unknown,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return axios.patch<T>(`${resourceUrl}/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        ...config,
    })
}

// PUT par URL complète
export async function putResourceByUrl<T = any>(
    resourceUrl: string,
    data: unknown,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return axios.put<T>(resourceUrl, data, {
        ...config,
    })
}

// DELETE générique
export async function removeResource<T = any>(
    resourceUrl: string,
    id: number | string,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return axios.delete<T>(`${resourceUrl}/${id}`, config)
}