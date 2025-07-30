# Collaborative Notes

Collaborative Notes est une application web moderne et collaborative pour la prise de notes, pensée pour la productivité individuelle et le travail en équipe.

L’application permet à chaque utilisateur de :

- Créer, modifier, supprimer et organiser ses notes personnelles
- Rédiger ses contenus en Markdown (aperçu en temps réel)
- Partager des notes avec d’autres utilisateurs (lecture seule)
- Générer un lien public pour rendre une note accessible à tous
- Rechercher et filtrer ses notes par titre, tag ou statut

Chaque note comporte :
- **Titre**
- **Contenu** (Markdown autorisé)
- **Date de création / modification**
- **Tag(s)** (optionnel)
- **Statut de visibilité** : privé / partagé / public

### Fonctionnalités principales

#### 1. Authentification & Sécurité
- Inscription (email + mot de passe)
- Connexion / Déconnexion
- Authentification sécurisée (JWT)
- Middleware de sécurisation des routes API

#### 2. Gestion des notes
- Créer une note
- Lister ses notes
- Modifier / supprimer une note
- Rechercher par titre ou tag
- Filtrer par statut (privé, partagé, public)

#### 3. Partage de notes
- Partager une note avec un autre utilisateur (lecture seule)
- Permettre l’accès via lien public (token URL ou identifiant)

#### 4. Interface Web
- Affichage des notes par statut (onglets ou filtres)
- Création/modification avec éditeur Markdown
- Barre de recherche et filtres dynamiques
- Interface responsive (desktop/mobile)
- Notifications de succès/erreur

L’ensemble est déjà déployé en ligne, avec :
- Un backend Node.js/Express (API REST documentée Swagger)
- Un frontend React/TypeScript/Tailwind CSS (Vite)

## Liens importants

- **Application hébergée (frontend)** : [https://collaborative-notes-xyz.vercel.app](https://collaborative-notes-xyz.vercel.app)
- **Documentation de l’API (Swagger)** : [https://collaborative-notes-oeoa.onrender.com/api-docs/](https://collaborative-notes-oeoa.onrender.com/api-docs/)
- **Dépôt Git public** : [https://github.com/Charlot-DEDJINOU/Collaborative-Notes](https://github.com/Charlot-DEDJINOU/Collaborative-Notes)

## Installation et exécution locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/Charlot-DEDJINOU/Collaborative-Notes.git
cd Collaborative-Notes
```

### 2. Installer le backend

```bash
cd backend
npm install
```

Configurer le fichier `.env` (voir `backend/README.md` pour le détail des variables nécessaires).

Démarrer le backend :

```bash
npm run dev
```

L’API sera accessible par défaut sur [http://localhost:3001](http://localhost:3001)

### 3. Installer le frontend

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev
```

L’application sera accessible sur [http://localhost:5173](http://localhost:5173)

## Déploiement

L’application est déjà déployée et accessible en ligne :

- **Frontend** : [https://collaborative-notes-xyz.vercel.app](https://collaborative-notes-xyz.vercel.app)
- **API/Swagger** : [https://collaborative-notes-oeoa.onrender.com/api-docs/](https://collaborative-notes-oeoa.onrender.com/api-docs/)

## Structure du projet

```
Collaborative-Notes/
  backend/    # API Express/Node.js
  frontend/   # Application React/Vite
```

Pour plus de détails sur chaque partie, consultez les fichiers `README.md` respectifs dans `backend/` et `frontend/`.

## Contribution

Les contributions sont les bienvenues ! Merci de consulter le dépôt GitHub pour proposer des améliorations ou signaler des bugs.