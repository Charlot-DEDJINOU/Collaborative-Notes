export type NoteVisibility = 'private' | 'shared' | 'public';

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  visibility: NoteVisibility;
  author: {
    _id: string;
    email: string;
  };
  sharedWith: string[];
  publicToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags: string[];
  visibility: NoteVisibility;
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
  _id: string;
}

export interface NotesResponse {
  notes: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Types pour les filtres et recherche
export interface NotesFilters {
  search?: string;
  tags?: string[];
  visibility?: NoteVisibility;
  page?: number;
  limit?: number;
}

export interface NotesContextType {
  notes: Note[];
  currentNote: Note | null;
  filters: NotesFilters;
  isLoading: boolean;
  error: string | null;
  pagination: NotesResponse['pagination'] | null;
  
  // Actions
  fetchNotes: (filters?: NotesFilters) => Promise<void>;
  createNote: (data: CreateNoteData) => Promise<Note>;
  updateNote: (data: UpdateNoteData) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  setCurrentNote: (note: Note | null) => void;
  setFilters: (filters: NotesFilters) => void;
  clearError: () => void;
  shareNote: (noteId: string, userEmail: string) => Promise<void>;
  getPublicNote: (token: string) => Promise<Note>;
  removeUserFromNote: (noteId: string, userId: string) => Promise<void>;
  buildPublicNoteUrl: (publicToken: string, baseUrl?: string) => string;
}
