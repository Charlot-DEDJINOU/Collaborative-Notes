# Collaborative Notes Frontend

Ce dossier contient le frontend de l'application Collaborative Notes, développé avec React, TypeScript ,Vite et Tailwind CSS.

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- npm (v9 ou supérieur recommandé)
- Un backend opérationnel (voir dossier `backend`)

## Installation

1. **Cloner le dépôt**

```bash
git clone https://github.com/Charlot-DEDJINOU/Collaborative-Notes
cd frontend
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du dossier `frontend` si besoin, par exemple :

```env
VITE_API_URI_BASE=http://localhost:3001
```

> **Remarque :** Adaptez l'URL selon l'adresse de votre backend.

4. **Démarrer l'application**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173) par défaut.

## Structure du projet

```
frontend/
  public/           # Fichiers statiques
  src/
    assets/        # Images et icônes
    components/    # Composants réutilisables
    contexts/      # Contextes React
    hooks/         # Hooks personnalisés
    layouts/       # Layouts globaux
    services/      # Appels API et helpers
    types/         # Types TypeScript
    views/         # Pages principales
    App.tsx        # Composant racine
    main.tsx       # Point d'entrée
    style.css      # Styles globaux
```

## Scripts utiles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Génère la version de production
- `npm run preview` : Prévisualise la build de production

## Configuration Vite

Les paramètres de Vite sont dans `vite.config.ts`.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.