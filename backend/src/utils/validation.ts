import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

export const noteSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200, 'Titre trop long'),
  content: z.string().min(1, 'Contenu requis'),
  tags: z.array(z.string()).optional().default([]),
  visibility: z.enum(['private', 'shared', 'public']).default('private')
});

export const updateNoteSchema = noteSchema.partial();

export const shareNoteSchema = z.object({
  userEmail: z.string().email('Email invalide')
});