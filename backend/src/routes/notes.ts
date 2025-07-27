import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  removeUserFromNote,
  getPublicNote
} from '../controllers/notesController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { noteSchema, updateNoteSchema, shareNoteSchema } from '../utils/validation';

const router = Router();

/**
 * @swagger
 * /api/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Créer une nouvelle note
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               visibility:
 *                 type: string
 *                 enum: [private, shared, public]
 *     responses:
 *       201:
 *         description: Note créée avec succès
 */
router.post('/', authenticate, validate(noteSchema), createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     tags: [Notes]
 *     summary: Récupérer les notes de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche dans le titre et contenu
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [private, shared, public]
 *         description: Filtrer par statut de visibilité
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filtrer par tags (séparés par des virgules)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des notes
 */
router.get('/', authenticate, getNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Récupérer une note par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la note
 *     responses:
 *       200:
 *         description: Note trouvée
 *       404:
 *         description: Note non trouvée
 */
router.get('/:id', authenticate, getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Modifier une note
 *     description: Met à jour une note. Si la visibilité passe à "private", tous les partages sont automatiquement supprimés.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               visibility:
 *                 type: string
 *                 enum: [private, shared, public]
 *                 description: Si "private" est sélectionné, la liste des utilisateurs partagés sera automatiquement vidée
 *     responses:
 *       200:
 *         description: Note mise à jour avec succès
 *       404:
 *         description: Note non trouvée ou non autorisée
 */
router.put('/:id', authenticate, validate(updateNoteSchema), updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Supprimer une note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la note
 *     responses:
 *       200:
 *         description: Note supprimée
 *       404:
 *         description: Note non trouvée
 */
router.delete('/:id', authenticate, deleteNote);

/**
 * @swagger
 * /api/notes/{id}/share:
 *   post:
 *     tags: [Notes]
 *     summary: Partager une note avec un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *             properties:
 *               userEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Note partagée avec succès
 *       404:
 *         description: Note ou utilisateur non trouvé
 */
router.post('/:id/share', authenticate, validate(shareNoteSchema), shareNote);

/**
 * @swagger
 * /api/notes/{id}/unshare:
 *   delete:
 *     tags: [Notes]
 *     summary: Retirer un utilisateur du partage d'une note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *             properties:
 *               userEmail:
 *                 type: string
 *                 format: email
 *                 description: Email de l'utilisateur à retirer du partage
 *     responses:
 *       200:
 *         description: Utilisateur retiré du partage avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 removedUser:
 *                   type: string
 *                 currentVisibility:
 *                   type: string
 *       400:
 *         description: Note non partagée avec cet utilisateur
 *       404:
 *         description: Note ou utilisateur non trouvé
 */
router.delete('/:id/unshare', authenticate, validate(shareNoteSchema), removeUserFromNote);

/**
 * @swagger
 * /api/notes/public/{token}:
 *   get:
 *     tags: [Notes]
 *     summary: Accéder à une note publique via token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token public de la note
 *     responses:
 *       200:
 *         description: Note publique
 *       404:
 *         description: Note publique non trouvée
 */
router.get('/public/:token', getPublicNote);

export default router;