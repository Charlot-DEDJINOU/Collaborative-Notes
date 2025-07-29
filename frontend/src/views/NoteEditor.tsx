import { useState, useEffect } from "react";
import { X, Plus, Globe, Users, Lock, Edit3, Save, ArrowLeft, Mail } from "lucide-react";
import MarkdownEditor from "../components/MarkdownEditor";
import Button from "../components/commons/Button";
import type { CreateNoteData, NoteVisibility, UserNote } from "../types/notes";
import Input from "../components/commons/Input";
import { useNotes } from "../contexts/NotesContext";
import { errorMessage, onServerSuccess } from "../services/helper";
import { useParams } from "react-router-dom";
import { useNotesService } from "../services/notesService";
import MDEditor from '@uiw/react-md-editor';

const NoteEditor = () => {
    const { noteId } = useParams()
    const [formData, setFormData] = useState<CreateNoteData>({
        title: "",
        content: "# Ma nouvelle note\n\nÉcrivez votre contenu ici...",
        tags: [],
        visibility: "private"
    });

    const { createNote, updateNote } = useNotes();
    const { getNoteById } = useNotesService();
    const [newTag, setNewTag] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!noteId); // Mode édition par défaut si pas d'ID
    const [isViewMode, setIsViewMode] = useState(!!noteId); // Mode vue si ID fourni
    const [originalData, setOriginalData] = useState<CreateNoteData | null>(null);
    const [updateSharedUsers, setUpdateSharedUsers] = useState<UserNote[] | null>(null)

    const visibilityOptions = [
        { value: 'private' as NoteVisibility, label: 'Privé', icon: Lock, color: 'text-purple-600', bg: 'bg-purple-50' },
        { value: 'shared' as NoteVisibility, label: 'Partagé', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { value: 'public' as NoteVisibility, label: 'Public', icon: Globe, color: 'text-red-600', bg: 'bg-red-50' }
    ];

    // Charger les données de la note si un ID est fourni
    useEffect(() => {
        if (noteId) {
            loadNoteData();
        }
    }, [noteId]);

    const loadNoteData = async () => {
        if (!noteId) return;

        setLoading(true);
        try {
            const noteData = await getNoteById(noteId);
            const loadedData = {
                title: noteData.title,
                content: noteData.content,
                tags: noteData.tags || [],
                visibility: noteData.visibility
            };
            setFormData(loadedData);
            setOriginalData(loadedData);
            if (noteData.sharedWith.length)
                setUpdateSharedUsers(noteData.sharedWith)
        } catch (error) {
            errorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) {
            newErrors.title = "Le titre est obligatoire";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Le contenu est obligatoire";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const resetForm = () => {
        if (noteId && originalData) {
            // Si on est en mode édition, revenir aux données originales
            setFormData(originalData);
        } else {
            // Si on est en mode création, vider le formulaire
            setFormData({
                title: "",
                content: "# Ma nouvelle note\n\nÉcrivez votre contenu ici...",
                tags: [],
                visibility: "private"
            });
        }
        setErrors({});
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsViewMode(false);
    };

    const handleCancelEdit = () => {
        resetForm();
        setIsEditing(false);
        setIsViewMode(true);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (noteId) {
                // Mode édition
                await updateNote({
                    ...formData,
                    _id: noteId
                });
                onServerSuccess("Note mise à jour avec succès");
                setOriginalData(formData);
                setIsEditing(false);
                setIsViewMode(true);
            } else {
                // Mode création
                await createNote(formData);
                onServerSuccess("Note créée avec succès");
                resetForm();
            }
        } catch (error) {
            errorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const getSelectedVisibilityOption = () => {
        return visibilityOptions.find(option => option.value === formData.visibility) || visibilityOptions[0];
    };

    const getPageTitle = () => {
        if (noteId) {
            return isEditing ? "Éditer la Note" : "Détails de la Note";
        }
        return "Créer une Note";
    };

    const getPageDescription = () => {
        if (noteId) {
            return isEditing ? "Modifiez votre note" : "Consultez les détails de votre note";
        }
        return "Créez et organisez vos notes avec style";
    };

    if (loading && noteId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-secondary-600">Chargement de la note...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-secondary-900 mb-2">
                        {getPageTitle()}
                    </h1>
                    <p className="text-lg text-secondary-600">
                        {getPageDescription()}
                    </p>
                </div>

                {/* Formulaire principal */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">

                    {/* Titre */}
                    <div className="space-y-2">
                        {isViewMode ? (
                            <div>
                                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                                    Titre de la note
                                </label>
                                <h2 className="text-2xl font-bold text-secondary-900">{formData.title}</h2>
                            </div>
                        ) : (
                            <Input
                                label="Titre de la note"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e }))}
                                error={errors.title}
                                placeholder="Donnez un titre à votre note..."
                            />
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="space-y-2" data-color-mode="light">
                        {
                            isViewMode ?
                                <MDEditor.Markdown source={formData.content} /> :
                                <MarkdownEditor
                                    value={formData.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    error={errors.content}
                                />
                        }
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-secondary-700">
                            Tags
                        </label>

                        {/* Ajout de tag - seulement en mode édition */}
                        {!isViewMode && (
                            <div className="flex gap-3">
                                <Input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e)}
                                    placeholder="Ajouter un tag..."
                                />
                                <Button onClick={handleAddTag} variant="secondary">
                                    <Plus className="w-4 h-4" />
                                    Ajouter
                                </Button>
                            </div>
                        )}

                        {/* Liste des tags */}
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-500 rounded-full text-sm font-medium"
                                    >
                                        {tag}
                                        {!isViewMode && (
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:bg-primary-200 rounded-full p-1 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visibilité */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-secondary-700">
                            Visibilité
                        </label>

                        {isViewMode ? (
                            // Affichage en mode lecture
                            <div className="p-4 rounded-xl border-2 bg-gray-50 border-gray-200">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const selectedOption = getSelectedVisibilityOption();
                                        const Icon = selectedOption.icon;
                                        return (
                                            <>
                                                <Icon className={`w-5 h-5 ${selectedOption.color}`} />
                                                <div>
                                                    <div className="font-medium text-secondary-900">{selectedOption.label}</div>
                                                    <div className="text-sm text-secondary-600">
                                                        {formData.visibility === 'private' && 'Visible par vous uniquement'}
                                                        {formData.visibility === 'shared' && 'Visible par les personnes invitées'}
                                                        {formData.visibility === 'public' && 'Visible par tout le monde'}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div >
                                {
                                    updateSharedUsers && updateSharedUsers.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {updateSharedUsers.map(user => (
                                                <div
                                                    key={user._id}
                                                    className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                                >
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        ) : (
                            // Sélection en mode édition
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {visibilityOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = formData.visibility === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${isSelected
                                                    ? `${option.bg} border-current ${option.color} shadow-lg`
                                                    : 'bg-white border-secondary-200 hover:border-secondary-300 text-secondary-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5" />
                                                <div>
                                                    <div className="font-medium">{option.label}</div>
                                                    <div className="text-sm opacity-75">
                                                        {option.value === 'private' && 'Visible par vous uniquement'}
                                                        {option.value === 'shared' && 'Visible par les personnes invitées'}
                                                        {option.value === 'public' && 'Visible par tout le monde'}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-6 border-t border-secondary-200">
                        <div className="text-sm text-secondary-500">
                            {!isViewMode && "* Champs obligatoires"}
                        </div>
                        <div className="flex gap-4">
                            {isViewMode ? (
                                // Boutons en mode vue
                                <>
                                    <Button onClick={handleEdit} variant="secondary">
                                        <Edit3 className="w-4 h-4" />
                                        Éditer
                                    </Button>
                                </>
                            ) : (
                                // Boutons en mode édition/création
                                <>
                                    {noteId && (
                                        <Button onClick={handleCancelEdit} variant="secondary">
                                            <ArrowLeft className="w-4 h-4" />
                                            Annuler
                                        </Button>
                                    )}
                                    {!noteId && (
                                        <Button onClick={resetForm} variant="secondary">
                                            Réinitialiser
                                        </Button>
                                    )}
                                    <Button onClick={handleSubmit} loading={loading}>
                                        <Save className="w-4 h-4" />
                                        {noteId ? "Sauvegarder" : "Publier la note"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;