import { useState, useEffect } from "react";
import { Globe, Calendar, User, Tag, Eye, Share2, Copy, Check } from "lucide-react";
import Button from "../components/commons/Button";
import type { Note } from "../types/notes";
import { useParams } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import { errorMessage } from "../services/helper";
import MDEditor from '@uiw/react-md-editor';

const PublicNote = () => {
    const { publicToken } = useParams();
    const { getPublicNote, buildPublicNoteUrl } = useNotes()
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if(publicToken)
            loadPublicNote();
    }, [publicToken]);

    const loadPublicNote = async () => {
        setLoading(true);
        try {
            const note = await getPublicNote(publicToken ?? "");
            setNote(note);
        } catch (error) {
            errorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyShareLink = async () => {
        const shareUrl = buildPublicNoteUrl(publicToken || "");
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            errorMessage("Impossible de copier le lien");
        }
    };

    const shareNote = async () => {
        const shareUrl = buildPublicNoteUrl(publicToken || "");
        if (navigator.share) {
            try {
                await navigator.share({
                    title: note?.title,
                    text: `Découvrez cette note publique: ${note?.title}`,
                    url: shareUrl,
                });
            } catch (error) {
                copyShareLink();
            }
        } else {
            copyShareLink();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-secondary-600">Chargement de la note...</p>
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">Note non trouvée</h2>
                    <p className="text-secondary-600">
                        Cette note n'existe pas ou n'est pas publique.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Header avec actions */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Globe className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-sm font-medium text-green-600">Note Publique</h1>
                            <p className="text-xs text-secondary-500">Partagée avec le monde</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={shareNote} variant="secondary" size="sm">
                            <Share2 className="w-4 h-4" />
                            Partager
                        </Button>
                        <Button onClick={copyShareLink} variant="secondary" size="sm">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copié !" : "Copier le lien"}
                        </Button>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* En-tête de la note */}
                    <div className="p-8 pb-6 border-b border-secondary-100">
                        <h1 className="text-4xl font-bold text-secondary-900 mb-6">
                            {note.title}
                        </h1>

                        {/* Métadonnées */}
                        <div className="flex flex-wrap gap-6 text-sm text-secondary-600">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Par {note.author.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Créé le {formatDate(note.createdAt)}</span>
                            </div>
                            {note.updatedAt !== note.createdAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Modifié le {formatDate(note.updatedAt)}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {note.tags.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Tag className="w-4 h-4 text-secondary-500" />
                                    <span className="text-sm font-medium text-secondary-700">Tags</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {note.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contenu de la note */}
                    <div className="mb-4 p-8" data-color-mode="light">
                        <p className="text-gray-700">
                            <MDEditor.Markdown source={note.content} />
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-secondary-50 border-t border-secondary-100">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-secondary-500">
                                Note publique • ID: {publicToken}
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={shareNote} variant="secondary" size="sm">
                                    <Share2 className="w-4 h-4" />
                                    Partager cette note
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message d'information */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <Globe className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="text-sm">
                            <p className="text-blue-800 font-medium mb-1">Note publique</p>
                            <p className="text-blue-700">
                                Cette note est publiquement accessible. Toute personne avec le lien peut la consulter.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicNote;