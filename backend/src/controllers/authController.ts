import { Request, Response } from 'express';
import { User } from '../models/User';
import { IAuthRequest } from '../types';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const generateToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as Secret,
        { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
    );
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
        }

        // Create new user
        const user = new User({ email, password });
        await user.save();

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Generate token
        const token = generateToken(user._id.toString());

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                _id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getProfile = async (req: IAuthRequest, res: Response) => {
    try {
        const user = req.user!;
        res.json({
            user: {
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};