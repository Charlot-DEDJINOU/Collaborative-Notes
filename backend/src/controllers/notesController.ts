import { Response } from 'express';
import { Note } from '../models/Note';
import { User } from '../models/User';
import { IAuthRequest } from '../types';
import { Types } from 'mongoose';

export const createNote = async (req: IAuthRequest, res: Response) => {
  try {
    const { title, content, tags, visibility } = req.body;
    const userId = req.user!._id;

    const note = new Note({
      title,
      content,
      tags: tags || [],
      visibility: visibility || 'private',
      author: userId
    });

    await note.save();
    await note.populate('author', 'email');

    res.status(201).json({
      message: 'Note créée avec succès',
      note
    });
  } catch (error) {
    console.error('Erreur lors de la création de la note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getNotes = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { search, status, tags, page = 1, limit = 10 } = req.query;

    let query: any = {
      $or: [
        { author: userId },
        { sharedWith: userId },
        // { visibility: 'public' }
      ]
    };

    // Filter by status
    if (status && ['private', 'shared', 'public'].includes(status as string)) {
      query.visibility = status;
    }

    // Filter by tags
    if (tags) {
      const tagArray = (tags as string).split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Search in title and content
    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const notes = await Note.find(query)
      .populate('author', 'email')
      .populate('sharedWith', 'email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getNoteById = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de note invalide' });
    }

    const note = await Note.findOne({
      _id: id,
      $or: [
        { author: userId },
        { sharedWith: userId },
        // { visibility: 'public' }
      ]
    }).populate('author', 'email').populate('sharedWith', 'email');

    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateNote = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;
    const updates = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de note invalide' });
    }

    const note = await Note.findOne({ _id: id, author: userId });
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée ou non autorisée' });
    }

    // Si le nouveau statut est "private", vider le tableau sharedWith
    if (updates.visibility === 'private') {
      updates.sharedWith = [];
    }

    Object.assign(note, updates);
    await note.save();
    await note.populate('author', 'email');

    res.json({
      message: 'Note mise à jour avec succès',
      note
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteNote = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de note invalide' });
    }

    const note = await Note.findOneAndDelete({ _id: id, author: userId });
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée ou non autorisée' });
    }

    res.json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const shareNote = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;
    const userId = req.user!._id;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de note invalide' });
    }

    // Find the note
    const note = await Note.findOne({ _id: id, author: userId });
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée ou non autorisée' });
    }

    // Find the user to share with
    const targetUser = await User.findOne({ email: userEmail });
    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Check if already shared
    if (note.sharedWith.includes(targetUser._id)) {
      return res.status(400).json({ error: 'Note déjà partagée avec cet utilisateur' });
    }

    // Add user to shared list
    note.sharedWith.push(targetUser._id);
    note.visibility = 'shared';
    await note.save();

    res.json({
      message: 'Note partagée avec succès',
      sharedWith: targetUser.email
    });
  } catch (error) {
    console.error('Erreur lors du partage de la note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const removeUserFromNote = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;
    const userId = req.user!._id;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de note invalide' });
    }

    // Find the note
    const note = await Note.findOne({ _id: id, author: userId });
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée ou non autorisée' });
    }

    // Find the user to remove
    const targetUser = await User.findOne({ email: userEmail });
    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Check if user is in shared list
    const userIndex = note.sharedWith.findIndex(sharedUserId => 
      sharedUserId.toString() === targetUser._id.toString()
    );

    if (userIndex === -1) {
      return res.status(400).json({ error: 'Cette note n\'est pas partagée avec cet utilisateur' });
    }

    // Remove user from shared list
    note.sharedWith.splice(userIndex, 1);

    // If no more users in shared list, change visibility to private
    if (note.sharedWith.length === 0 && note.visibility === 'shared') {
      note.visibility = 'private';
    }

    await note.save();

    res.json({
      message: 'Utilisateur retiré du partage avec succès',
      removedUser: targetUser.email,
      currentVisibility: note.visibility
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du partage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getPublicNote = async (req: any, res: Response) => {
  try {
    const { token } = req.params;

    const note = await Note.findOne({
      publicToken: token,
      visibility: 'public'
    }).populate('author', 'email');

    if (!note) {
      return res.status(404).json({ error: 'Note publique non trouvée' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Erreur lors de la récupération de la note publique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};