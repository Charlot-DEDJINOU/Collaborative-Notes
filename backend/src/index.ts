import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { connectDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter, authLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';
import dashboardRoutes from './routes/dashboard';

const app = express();

const PORT = process.env.APP_PORT
const APP_PRODUCTION_URI = process.env.APP_PRODUCTION_URI

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://collaborative-notes.vercel.app']
    : ['http://localhost:5173'],
  credentials: true
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Notes API Documentation'
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/dashboard', dashboardRoutes)

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      if (process.env.NODE_ENV === "production") {
        console.log(`Documentation API: ${APP_PRODUCTION_URI}/api-docs`);
        console.log(`Health check: ${APP_PRODUCTION_URI}/health`);
      } else {
        console.log(`Documentation API: http://localhost:${PORT}/api-docs`);
        console.log(`Health check: http://localhost:${PORT}/health`);
      }
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu, arrêt du serveur...');
  process.exit(0);
});

startServer();