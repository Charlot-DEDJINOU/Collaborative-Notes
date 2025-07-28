import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { 
  Note, 
  CreateNoteData, 
  UpdateNoteData, 
  NotesFilters, 
  NotesResponse,
  NotesContextType 
} from '../types/notes';
import { useNotesService } from '../services/notesService';

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Créer une instance du service
const notes = useNotesService();

// Actions pour le reducer
type NotesAction =
  | { type: 'FETCH_NOTES_START' }
  | { type: 'FETCH_NOTES_SUCCESS'; payload: NotesResponse }
  | { type: 'FETCH_NOTES_FAILURE'; payload: string }
  | { type: 'CREATE_NOTE_SUCCESS'; payload: Note }
  | { type: 'UPDATE_NOTE_SUCCESS'; payload: Note }
  | { type: 'DELETE_NOTE_SUCCESS'; payload: string }
  | { type: 'SET_CURRENT_NOTE'; payload: Note | null }
  | { type: 'SET_FILTERS'; payload: NotesFilters }
  | { type: 'CLEAR_ERROR' };

// État initial
interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  filters: NotesFilters;
  isLoading: boolean;
  error: string | null;
  pagination: NotesResponse['pagination'] | null;
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  filters: {
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
  pagination: null,
};

// Reducer pour gérer l'état des notes
function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'FETCH_NOTES_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_NOTES_SUCCESS':
      return {
        ...state,
        notes: action.payload.notes,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case 'FETCH_NOTES_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'CREATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        currentNote: action.payload,
      };

    case 'UPDATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map(note =>
          note._id === action.payload._id ? action.payload : note
        ),
        currentNote: state.currentNote?._id === action.payload._id 
          ? action.payload 
          : state.currentNote,
      };

    case 'DELETE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.filter(note => note._id !== action.payload),
        currentNote: state.currentNote?._id === action.payload 
          ? null 
          : state.currentNote,
      };

    case 'SET_CURRENT_NOTE':
      return {
        ...state,
        currentNote: action.payload,
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// Provider du contexte des notes
export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const fetchNotes = useCallback(async (filters?: NotesFilters) => {
    dispatch({ type: 'FETCH_NOTES_START' });
    
    try {
      const finalFilters = { ...state.filters, ...filters };
      const response = await notes.getNotes(finalFilters);
      
      dispatch({ type: 'FETCH_NOTES_SUCCESS', payload: response });
      
      if (filters) {
        dispatch({ type: 'SET_FILTERS', payload: filters });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors du chargement des notes';
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: message });
      throw error;
    }
  }, [state.filters]);

  const createNote = useCallback(async (data: CreateNoteData): Promise<Note> => {
    try {
      const note = await notes.createNote(data);
      dispatch({ type: 'CREATE_NOTE_SUCCESS', payload: note });
      return note;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la création de la note';
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const updateNote = useCallback(async (data: UpdateNoteData): Promise<Note> => {
    try {
      const note = await notes.updateNote(data);
      dispatch({ type: 'UPDATE_NOTE_SUCCESS', payload: note });
      return note;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la modification de la note';
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    try {
      await notes.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE_SUCCESS', payload: id });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la suppression de la note';
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const setCurrentNote = useCallback((note: Note | null) => {
    dispatch({ type: 'SET_CURRENT_NOTE', payload: note });
  }, []);

  const setFilters = useCallback((filters: NotesFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const shareNote = useCallback(async (noteId: string, userEmail: string): Promise<void> => {
    try {
      await notes.shareNote(noteId, userEmail);
      // Recharger la note pour obtenir la liste mise à jour des utilisateurs partagés
      const updatedNote = await notes.getNoteById(noteId);
      dispatch({ type: 'UPDATE_NOTE_SUCCESS', payload: updatedNote });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors du partage de la note';
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const getPublicNote = useCallback(async (token: string): Promise<Note> => {
    try {
      return await notes.getPublicNote(token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la récupération de la note publique';
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const removeUserFromNote = useCallback(async (noteId: string, userId: string): Promise<void> => {
    try {
      await notes.removeUserFromNote(noteId, userId);
      // Recharger la note pour obtenir la liste mise à jour des utilisateurs partagés
      const updatedNote = await notes.getNoteById(noteId);
      dispatch({ type: 'UPDATE_NOTE_SUCCESS', payload: updatedNote });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'utilisateur';
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const buildPublicNoteUrl = useCallback((publicToken: string, baseUrl?: string): string => {
    return notes.buildPublicNoteUrl(publicToken, baseUrl);
  }, []);

  const value: NotesContextType = {
    ...state,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    setFilters,
    clearError,
    shareNote,
    getPublicNote,
    removeUserFromNote,
    buildPublicNoteUrl,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

// Hook pour utiliser le contexte des notes
export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes doit être utilisé dans un NotesProvider');
  }
  return context;
};