import { Response } from 'express';
import { Note } from '../models/Note';
import { IAuthRequest } from '../types';
import { Types } from 'mongoose';

export const getDashboardInfos = async (req: IAuthRequest, res: Response) => {
    try {
        const userId = req.user!._id; // Supposant que ton middleware auth ajoute req.user
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // 1. Statistiques générales
        const [totalNotes, privateNotes, sharedNotes, publicNotes, notesThisMonth] = await Promise.all([
            Note.countDocuments({ author: userId }),
            Note.countDocuments({ author: userId, visibility: 'private' }),
            Note.countDocuments({ author: userId, visibility: 'shared' }),
            Note.countDocuments({ author: userId, visibility: 'public' }),
            Note.countDocuments({
                author: userId,
                createdAt: { $gte: startOfMonth }
            })
        ]);

        // 2. Notes récentes (5 dernières)
        const recentNotes = await Note.find({ author: userId })
            .select('title content visibility tags createdAt updatedAt')
            .sort({ updatedAt: -1 })
            .limit(5)
            .lean();

        // Tronquer le contenu pour l'aperçu
        const recentNotesWithPreview = recentNotes.map(note => ({
            ...note,
            content: note.content.length > 150
                ? note.content.substring(0, 150) + '...'
                : note.content
        }));

        // 3. Notes partagées avec l'utilisateur (5 dernières)
        const sharedWithMe = await Note.find({
            sharedWith: userId,
            author: { $ne: userId } // Exclure ses propres notes
        })
            .select('title content tags createdAt author')
            .populate('author', 'email')
            .sort({ updatedAt: -1 })
            .limit(5)
            .lean();

        const sharedWithMePreview = sharedWithMe.map(note => ({
            ...note,
            content: note.content.length > 150
                ? note.content.substring(0, 150) + '...'
                : note.content
        }));

        // 4. Tags les plus utilisés
        const topTagsResult = await Note.aggregate([
            { $match: { author: new Types.ObjectId(userId) } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { tag: '$_id', count: 1, _id: 0 } }
        ]);

        const dashboardData = {
            stats: {
                totalNotes,
                privateNotes,
                sharedNotes,
                publicNotes,
                notesThisMonth
            },
            recentNotes: recentNotesWithPreview,
            sharedWithMe: sharedWithMePreview,
            topTags: topTagsResult
        };

        res.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error('Erreur dashboard:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des données du dashboard'
        });
    }
}


export const getQuickStats = async (req: IAuthRequest, res: Response) => {
    try {
        const userId = req.user!._id;
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [totalNotes, notesThisWeek, notesThisMonth] = await Promise.all([
            Note.countDocuments({ author: userId }),
            Note.countDocuments({
                author: userId,
                createdAt: { $gte: startOfWeek }
            }),
            Note.countDocuments({
                author: userId,
                createdAt: { $gte: startOfMonth }
            })
        ]);

        res.json({
            success: true,
            data: {
                totalNotes,
                notesThisWeek,
                notesThisMonth
            }
        });

    } catch (error) {
        console.error('Erreur quick-stats:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des statistiques'
        });
    }
}