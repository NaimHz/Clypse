# Clyps – Plateforme de gestion de cigarettes électroniques connectées

## Prérequis
- Node.js ≥ 18.x
- npm ≥ 9.x
- MongoDB (local ou Atlas)

---

## Installation rapide

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd Clyps
   ```

2. **Installer les dépendances**
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```

---

## Lancement du projet

- **Backend**
  ```bash
  cd Backend
  npm start
  ```
  Accès API : [http://localhost:3000/](http://localhost:3000/)

- **Frontend**
  ```bash
  cd Frontend
  npm run dev
  ```
  Accès app : [http://localhost:5173/](http://localhost:5173/)

---

## Documentation API

- Swagger : [http://localhost:3000/v1/docs](http://localhost:3000/v1/docs)

---

## Utilisation – Utilisateur

- **Créer un compte** : Page d'inscription, puis connexion avec email/mot de passe.
- **Associer une vape** : Saisir le code de la vape ou scanner le QR code dans l'interface.
- **Dashboard** : Visualiser la consommation, l'état de la batterie, les statistiques et l'historique.
- **Paramètres** : Modifier ses informations, changer le mot de passe, configurer ses préférences.
- **Notifications** : Recevoir des alertes sur la consommation ou la maintenance.
- **PWA** : Installer l'application sur mobile via "Ajouter à l'écran d'accueil".

---

## Administration – Admin

- **Gestion des utilisateurs** :
  - Voir la liste des utilisateurs
  - Modifier ou supprimer un utilisateur
  - Réinitialiser un mot de passe utilisateur
- **Gestion des vapes** :
  - Ajouter, modifier ou supprimer une vape
  - Associer/dissocier une vape à un utilisateur
- **Suivi et statistiques** :
  - Accéder aux statistiques globales de consommation
  - Consulter les logs d'activité
- **Maintenance** :
  - Réinitialiser la base de données (seed)
  - Sauvegarder/restaurer les données
- **Sécurité** :
  - Gérer les droits d'accès (admin/user)
  - Surveiller les tentatives de connexion

---

## Routes principales

- **Authentification** :
  `POST /v1/auth/register` – Inscription
  `POST /v1/auth/login` – Connexion

- **Utilisateurs** :
  `GET /v1/users/me` – Infos utilisateur

- **Vapes** :
  `GET /v1/vape/user/vapes` – Mes vapes
  `POST /v1/vape/user/link` – Lier une vape

- **Consommation** :
  `GET /v1/consumption` – Consommation globale
  `POST /v1/consumption/vape/:vapeId/puff` – Ajouter une bouffée

---

## Tests

- **Backend** :
  ```bash
  cd Backend
  npm test
  ```
- **Frontend** :
  ```bash
  cd Frontend
  npm run test
  ```

---

## Déploiement

- Backend : Render, Heroku, etc.
- Frontend : Vercel, Netlify, etc.

---

**Contact** : [email@exemple.com](mailto:email@exemple.com)
