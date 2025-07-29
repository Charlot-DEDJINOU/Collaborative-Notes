import express from 'express';
import { authenticate } from '../middleware/auth';
import { getDashboardInfos, getQuickStats } from '../controllers/dashboardController';

const router = express.Router()
/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Récupère les données du tableau de bord utilisateur
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données du tableau de bord récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalNotes:
 *                           type: number
 *                           example: 25
 *                         privateNotes:
 *                           type: number
 *                           example: 15
 *                         sharedNotes:
 *                           type: number
 *                           example: 7
 *                         publicNotes:
 *                           type: number
 *                           example: 3
 *                         notesThisMonth:
 *                           type: number
 *                           example: 8
 *                     recentNotes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                             description: Aperçu du contenu (150 premiers caractères)
 *                           visibility:
 *                             type: string
 *                             enum: [private, shared, public]
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     sharedWithMe:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           author:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     topTags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           tag:
 *                             type: string
 *                           count:
 *                             type: number
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticate, getDashboardInfos );

/**
 * @swagger
 * /api/dashboard/quick-stats:
 *   get:
 *     summary: Récupère uniquement les statistiques rapides
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques rapides récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalNotes:
 *                       type: number
 *                     notesThisWeek:
 *                       type: number
 *                     notesThisMonth:
 *                       type: number
 */
router.get('/quick-stats', authenticate, getQuickStats);

export default router;