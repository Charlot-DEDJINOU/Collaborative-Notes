import { useState, useEffect } from "react";
import { Plus, Users, Lock, Globe, TrendingUp, Calendar, Tag, FileText, Share2 } from "lucide-react";
import Button from "../components/commons/Button";
import { errorMessage } from "../services/helper";
import { getResource } from "../services/api";
import { Link } from "react-router-dom";
import MDEditor from '@uiw/react-md-editor';

interface DashboardStats {
    totalNotes: number;
    privateNotes: number;
    sharedNotes: number;
    publicNotes: number;
    notesThisMonth: number;
}

interface RecentNote {
    _id: string;
    title: string;
    content: string;
    visibility: 'private' | 'shared' | 'public';
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

interface SharedNote {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    author: {
        _id: string;
        email: string;
    };
}

interface TopTag {
    tag: string;
    count: number;
}

interface DashboardData {
    stats: DashboardStats;
    recentNotes: RecentNote[];
    sharedWithMe: SharedNote[];
    topTags: TopTag[];
}

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const result = await getResource("/dashboard");
            setDashboardData(result.data.data);
        } catch (error) {
            errorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case 'private': return <Lock className="w-4 h-4 text-purple-600" />;
            case 'shared': return <Users className="w-4 h-4 text-emerald-600" />;
            case 'public': return <Globe className="w-4 h-4 text-red-600" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getVisibilityColor = (visibility: string) => {
        switch (visibility) {
            case 'private': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'shared': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'public': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-secondary-600">Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-secondary-600">Erreur lors du chargement des données</p>
                    <Button onClick={loadDashboardData} className="mt-4">
                        Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    const { stats, recentNotes, sharedWithMe, topTags } = dashboardData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
                            Tableau de bord
                        </h1>
                        <p className="text-lg text-secondary-600">
                            Vue d'ensemble de vos notes
                        </p>
                    </div>
                    <Link to="/notes/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle note
                        </Button>
                    </Link>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary-600">Total Notes</p>
                                <p className="text-3xl font-bold text-secondary-900">{stats.totalNotes}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary-600">Privées</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.privateNotes}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Lock className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary-600">Partagées</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.sharedNotes}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary-600">Publiques</p>
                                <p className="text-3xl font-bold text-red-600">{stats.publicNotes}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Globe className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary-600">Ce mois</p>
                                <p className="text-3xl font-bold text-green-600">{stats.notesThisMonth}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Notes récentes */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-secondary-100">
                        <div className="p-6 border-b border-secondary-100">
                            <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Notes récentes
                            </h2>
                        </div>
                        <div className="p-6">
                            {recentNotes.length > 0 ? (
                                <div className="space-y-4">
                                    {recentNotes.map((note) => (
                                        <div key={note._id} className="p-4 border border-secondary-100 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-semibold text-secondary-900 line-clamp-1">{note.title}</h3>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getVisibilityColor(note.visibility)}`}>
                                                    <div className="flex items-center gap-1">
                                                        {getVisibilityIcon(note.visibility)}
                                                        {note.visibility}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                                                <div className="mb-4" data-color-mode="light">
                                                    <p className="text-gray-700 line-clamp-2">
                                                        <MDEditor.Markdown source={note.content} />
                                                    </p>
                                                </div>
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {note.tags.slice(0, 2).map((tag, index) => (
                                                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {note.tags.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                            +{note.tags.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-secondary-500">{formatDate(note.updatedAt)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                                    <p className="text-secondary-500">Aucune note récente</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Notes partagées avec moi */}
                        <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
                            <div className="p-6 border-b border-secondary-100">
                                <h2 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Partagées avec moi
                                </h2>
                            </div>
                            <div className="p-6">
                                {sharedWithMe.length > 0 ? (
                                    <div className="space-y-3">
                                        {sharedWithMe.map((note) => (
                                            <div key={note._id} className="p-3 border border-secondary-100 rounded-lg">
                                                <h4 className="font-medium text-secondary-900 text-sm mb-1 line-clamp-1">{note.title}</h4>
                                                <p className="text-xs text-secondary-600 mb-2 line-clamp-2">
                                                    <div className="mb-4" data-color-mode="light">
                                                        <p className="text-gray-700 line-clamp-2">
                                                            <MDEditor.Markdown source={note.content} />
                                                        </p>
                                                    </div>
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-secondary-500">Par {note.author.email}</span>
                                                    <span className="text-xs text-secondary-400">{formatDate(note.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Users className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                                        <p className="text-sm text-secondary-500">Aucune note partagée</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags populaires */}
                        <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
                            <div className="p-6 border-b border-secondary-100">
                                <h2 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Tags populaires
                                </h2>
                            </div>
                            <div className="p-6">
                                {topTags.length > 0 ? (
                                    <div className="space-y-2">
                                        {topTags.map((tagData, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm text-secondary-700">{tagData.tag}</span>
                                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                                    {tagData.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Tag className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                                        <p className="text-sm text-secondary-500">Aucun tag utilisé</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;