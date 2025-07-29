import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Share2,
    Eye,
    Lock,
    Users,
    Globe,
    X,
    Mail,
    Tag,
    Calendar,
    User,
    Link2,
    Copy,
    Trash
} from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import type { Note, NoteVisibility } from '../types/notes';
import { errorMessage, onServerSuccess } from '../services/helper';
import Input from '../components/commons/Input';
import Select from '../components/commons/Select';
import Button from '../components/commons/Button';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotFound from './NotFound';
import MDEditor from '@uiw/react-md-editor';

const Notes = () => {
    const {
        notes,
        isLoading,
        pagination,
        fetchNotes,
        updateNote,
        deleteNote,
        shareNote,
        removeUserFromNote,
        buildPublicNoteUrl,
        setFilters,
    } = useNotes();
    const { type } = useParams();
    const { user } = useAuth()
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVisibility, setSelectedVisibility] = useState<NoteVisibility | ''>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [loadingShare, setLoadingShare] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [shareEmail, setShareEmail] = useState('');

    // Charger les notes au montage du composant
    useEffect(() => {
        fetchNotes(type || "own");
    }, [fetchNotes, type]);

    const filters = useMemo(() => ({
        search: searchTerm || undefined,
        visibility: selectedVisibility || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        page: 1,
    }), [searchTerm, selectedVisibility, selectedTags]);

    const search = () => {
        setFilters(filters);
    }

    // Obtenir tous les tags uniques
    const allTags = [...new Set(notes.flatMap(note => note.tags))];

    const getVisibilityIcon = (visibility: NoteVisibility) => {
        switch (visibility) {
            case 'private':
                return <Lock className="w-4 h-4 text-purple-600" />;
            case 'shared':
                return <Users className="w-4 h-4 text-green-600" />;
            case 'public':
                return <Globe className="w-4 h-4 text-red-600" />;
        }
    };

    const getVisibilityColor = (visibility: NoteVisibility) => {
        switch (visibility) {
            case 'private':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'shared':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'public':
                return 'bg-red-100 text-red-800 border-red-200';
        }
    };

    const handleVisibilityChange = async (note: Note, newVisibility: NoteVisibility) => {
        try {
            await updateNote({
                _id: note._id,
                title: note.title,
                content: note.content,
                tags: note.tags,
                visibility: newVisibility
            });
            onServerSuccess(`Note changée en ${newVisibility} avec succès`)
        } catch (error) {
            errorMessage(error)
            console.error('Erreur lors de la mise à jour de la visibilité:', error);
        }
    };

    const handleShareNote = async () => {
        if (!selectedNote || !shareEmail) return;
        setLoadingShare(true)
        try {
            await shareNote(selectedNote._id, shareEmail);
            setShowShareModal(false);
            onServerSuccess(`Note partagée avec ${shareEmail} avec succès`)
            setShareEmail('');
            setSelectedNote(null);
        } catch (error) {
            errorMessage(error)
            console.error('Erreur lors du partage:', error);
        } finally {
            setLoadingShare(false);
        }
    };

    const handleDeleteNote = async () => {
        if (!selectedNote) return;
        setLoadingDelete(true)
        try {
            await deleteNote(selectedNote._id);
            setShowDeleteModal(false);
            onServerSuccess(`Note ${selectedNote.title} supprimée avec succès`)
            setSelectedNote(null);
        } catch (error) {
            errorMessage(error)
            console.error('Erreur lors du partage:', error);
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleRemoveUser = async (noteId: string, email: string) => {
        try {
            await removeUserFromNote(noteId, email);
            onServerSuccess(`${email} supprimé de votre note avec succès`)
        } catch (error) {
            errorMessage(error)
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        }
    };

    const toggleTagFilter = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (type !== "own" && type !== "shared")
        return <NotFound />

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {
                            type === "own" ? "Mes Notes" :
                                type === "shared" ? "Notes partagées avec moi" :
                                    "Notes"
                        }
                    </h1>
                    <p className="text-gray-600">Gérez et organisez vos notes facilement</p>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Rechercher dans toutes les notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtre par visibilité */}
                        <div>
                            <Select
                                value={selectedVisibility}
                                onChange={(e) => setSelectedVisibility(e as NoteVisibility | '')}
                                options={[
                                    { label: "Toutes les visibilités", value: "" },
                                    { label: "Privé", value: "private" },
                                    { label: "Partagé", value: "shared" },
                                    { label: "Public", value: "public" }
                                ]}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:primary-500 focus:border-transparent"
                            />
                        </div>
                        <Button onClick={search}>
                            <Search className="text-white mx-2 w-5 h-5" />
                            Rechercher
                        </Button>
                    </div>

                    {/* Tags */}
                    {allTags.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Filtrer par tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTagFilter(tag)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Liste des notes */}
                <div className="grid gap-6">
                    {notes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune note trouvée</h3>
                            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                        </div>
                    ) : (
                        notes.map(note => (
                            <div key={note._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="p-6">
                                    {/* Header de la note */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(note.createdAt)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    {note.author.email}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badge de visibilité */}
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getVisibilityColor(note.visibility)}`}>
                                            {getVisibilityIcon(note.visibility)}
                                            {note.visibility === 'private' && 'Privé'}
                                            {note.visibility === 'shared' && 'Partagé'}
                                            {note.visibility === 'public' && 'Public'}
                                        </div>
                                    </div>

                                    {/* Contenu de la note */}
                                    <div className="mb-4" data-color-mode="light">
                                        <p className="text-gray-700 line-clamp-2">
                                            <MDEditor.Markdown source={note.content} />
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    {note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {note.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Utilisateurs partagés */}
                                    {note.author._id === user?._id && note.sharedWith && note.sharedWith.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Partagé avec:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {note.sharedWith.map(user => (
                                                    <div
                                                        key={user._id}
                                                        className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                                    >
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                        <button
                                                            onClick={() => handleRemoveUser(note._id, user.email)}
                                                            className="text-green-600 hover:text-red-600 ml-1"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {
                                        note.author._id === user?._id && (
                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                                {/* Changer la visibilité */}
                                                <div>
                                                    <Select
                                                        value={note.visibility}
                                                        onChange={(e) => handleVisibilityChange(note, e as NoteVisibility)}
                                                        options={[
                                                            { label: "Toutes les visibilités", value: "" },
                                                            { label: "Privé", value: "private" },
                                                            { label: "Partagé", value: "shared" },
                                                            { label: "Public", value: "public" }
                                                        ]}
                                                    />
                                                </div>
                                                {/* Partager */}
                                                <Button
                                                    onClick={() => {
                                                        setSelectedNote(note);
                                                        setShowShareModal(true);
                                                    }}
                                                    variant='primary'
                                                    className="flex items-center gap-2"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                    Partager
                                                </Button>

                                                {/* Voir détails */}
                                                <Link to={`/notes/edit/${note._id}`}>
                                                    <Button
                                                        onClick={() => null}
                                                        variant='secondary'
                                                        className="flex items-center gap-2 bg-secondary-800 text-white"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Détails
                                                    </Button>
                                                </Link>

                                                {/* Voir détails */}
                                                <Button
                                                    onClick={() => {
                                                        setSelectedNote(note);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    variant='error'
                                                    className="flex items-center gap-2"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                    Supprimer
                                                </Button>
                                            </div>
                                        )
                                    }
                                    {
                                        note.author._id !== user?._id && (
                                            <Link to={`/notes/show/${note._id}`}>
                                                <Button
                                                    onClick={() => null}
                                                    variant='success'
                                                    className="flex items-center gap-2 bg-secondary-800 text-white"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Voir plus
                                                </Button>
                                            </Link>
                                        )
                                    }
                                    {note.publicToken && (
                                        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4">
                                            <Link2 className="w-6 h-6 text-primary-500" />
                                            <div className="flex-1">
                                                <p className="text-secondary-900 font-medium">Lien public :</p>
                                                <a
                                                    href={buildPublicNoteUrl(note.publicToken)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block mt-1 text-primary-600 hover:text-primary-800 underline truncate"
                                                    title={buildPublicNoteUrl(note.publicToken)}
                                                >
                                                    {buildPublicNoteUrl(note.publicToken)}
                                                </a>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(buildPublicNoteUrl(note.publicToken || ""))
                                                    onServerSuccess("Lien public copié avec succès")
                                                }}
                                                variant='primary'
                                            >
                                                <Copy className="w-5 h-5" />
                                                <span>Copier</span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex gap-2">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => fetchNotes("own", { page })}
                                    className={`px-4 py-2 rounded-lg font-medium ${page === pagination.page
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal de partage */}
                {showShareModal && selectedNote && (
                    <div className="fixed inset-0 bg-[#000000BF] flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Partager la note</h3>
                                <button
                                    onClick={() => {
                                        setShowShareModal(false);
                                        setSelectedNote(null);
                                        setShareEmail('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Partager <b>{selectedNote.title}</b> avec un utilisateur
                            </p>

                            <div className="mb-4">
                                <Input
                                    label="Email de l'utilisateur"
                                    type="email"
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e)}
                                    placeholder="exemple@email.com"

                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        setShowShareModal(false);
                                        setSelectedNote(null);
                                        setShareEmail('');
                                    }}
                                    variant='secondary'
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleShareNote}
                                    disabled={!shareEmail}
                                    variant='primary'
                                    loading={loadingShare}
                                >
                                    Partager
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && selectedNote && (
                    <div className="fixed inset-0 bg-[#000000BF] flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Partager la note</h3>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedNote(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Vous-voulez vraiment supprimer la note <b>{selectedNote.title}</b> ?
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedNote(null);
                                    }}
                                    variant='secondary'
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleDeleteNote}
                                    variant='error'
                                    loading={loadingDelete}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;