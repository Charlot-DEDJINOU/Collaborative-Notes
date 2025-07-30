# Collaborative Notes Backend

Ce projet constitue la partie backend de l'application Collaborative Notes, une API RESTful développée avec Node.js, Express et TypeScript.

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- npm (v9 ou supérieur recommandé)
- Une base de données MongoDB (locale ou distante)

## Installation

1. **Cloner le dépôt**

```bash
git clone https://github.com/Charlot-DEDJINOU/Collaborative-Notes
cd backend
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du dossier `backend` en vous basant sur l'exemple ci-dessous :

```env
APP_PORT=3001
APP_PRODUCTION_URI=https://votre-domaine.com
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/collaborative-notes
FRONT_APP_URI=http://localhost:5173
JWT_SECRET=un_secret_pour_le_jwt
```

> **Remarque :** Adaptez les valeurs selon votre environnement.

4. **Démarrer le serveur**

- En mode développement :

```bash
npm run dev
```

- En mode production :

```bash
npm run build
npm start
```

## Fonctionnalités principales

### Authentification & Sécurité
- Inscription et connexion sécurisées (JWT)
- Middleware de protection des routes API

### Gestion des notes
- Création, modification, suppression de notes
- Recherche par titre ou tag
- Filtrage par statut (privé, partagé, public)
- Ajout de tags (optionnel)
- Historique de création/modification

### Partage & accès
- Partage de notes avec d'autres utilisateurs (lecture seule)
- Accès public via lien unique (token ou identifiant)

### API & Outils
- Documentation Swagger interactive sur `/api-docs`
- Limitation de débit (rate limiting)
- Endpoint de vérification de santé `/health`

## Structure du projet

```
backend/
  src/
    config/         # Configuration (DB, Swagger)
    controllers/    # Logique métier
    middleware/     # Middlewares Express
    models/         # Modèles Mongoose
    routes/         # Définition des routes
    types/          # Types TypeScript
    utils/          # Fonctions utilitaires
    index.ts        # Point d'entrée principal
```

## Documentation API

Après démarrage, accédez à la documentation interactive :

- En développement : [http://localhost:3001/api-docs](http://localhost:5000/api-docs)
- En production : `https://votre-domaine.com/api-docs`

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.