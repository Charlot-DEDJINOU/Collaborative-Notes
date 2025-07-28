import type {
    Note,
    CreateNoteData,
    UpdateNoteData,
    NotesResponse,
    NotesFilters,
} from '../types/notes'
import { getResource, postResource, putResource, removeResource } from './api'

export const useNotesService = () => {
    async function getNotes(filters: NotesFilters = {}): Promise<NotesResponse> {
        try {
            const params = new URLSearchParams()

            if (filters.search) params.append('search', filters.search)
            if (filters.visibility) params.append('visibility', filters.visibility)
            if (filters.tags && filters.tags.length > 0) {
                filters.tags.forEach(tag => params.append('tags', tag))
            }
            if (filters.page) params.append('page', filters.page.toString())
            if (filters.limit) params.append('limit', filters.limit.toString())

            const query = params.toString()
            const endpoint = `/notes${query ? `?${query}` : ''}`

            const response = await getResource<NotesResponse>(endpoint)
            return response.data
        } catch (error) {
            console.error('[NOTES] Erreur lors de la récupération des notes :', error)
            throw error
        }
    }

    async function getNoteById(id: string): Promise<Note> {
        try {
            const response = await getResource<Note>(`/notes/${id}`)
            return response.data
        } catch (error) {
            console.error(`[NOTES] Erreur lors de la récupération de la note ${id} :`, error)
            throw error
        }
    }

    async function createNote(data: CreateNoteData): Promise<Note> {
        try {
            const response = await postResource<Note>('/notes', data)
            return response.data
        } catch (error) {
            console.error('[NOTES] Erreur lors de la création de la note :', error)
            throw error
        }
    }

    async function updateNote(data: UpdateNoteData): Promise<Note> {
        try {
            const { _id, ...updateData } = data
            const response = await putResource<Note>('/notes', _id, updateData)
            return response.data
        } catch (error) {
            console.error(`[NOTES] Erreur lors de la mise à jour de la note ${data._id} :`, error)
            throw error
        }
    }

    async function deleteNote(id: string): Promise<void> {
        try {
            await removeResource('/notes', id)
        } catch (error) {
            console.error(`[NOTES] Erreur lors de la suppression de la note ${id} :`, error)
            throw error
        }
    }

    async function shareNote(noteId: string, userEmail: string): Promise<void> {
        try {
            await postResource(`/notes/${noteId}/share`, { email: userEmail })
        } catch (error) {
            console.error(`[NOTES] Erreur lors du partage de la note ${noteId} :`, error)
            throw error
        }
    }

    async function getPublicNote(token: string): Promise<Note> {
        try {
            const response = await getResource<Note>(`/public/${token}`)
            return response.data
        } catch (error) {
            console.error(`[NOTES] Erreur lors de la récupération de la note publique ${token} :`, error)
            throw error
        }
    }

    async function removeUserFromNote(noteId: string, userId: string): Promise<void> {
        try {
            await removeResource(`/notes/${noteId}/unshare`, userId)
        } catch (error) {
            console.error(`[NOTES] Erreur lors de la suppression de l'utilisateur ${userId} de la note ${noteId} :`, error)
            throw error
        }
    }

    function buildPublicNoteUrl(publicToken: string, baseUrl?: string): string {
        const base = baseUrl || window.location.origin
        return `${base}/public/${publicToken}`
    }

    return{
        getNotes,
        getNoteById,
        createNote,
        updateNote,
        deleteNote,
        shareNote,
        getPublicNote,
        removeUserFromNote,
        buildPublicNoteUrl
    }
}