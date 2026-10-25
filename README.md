# LearnEFD - App Trilingue (Français • English • دری / Dari)

Application mobile & tablette professionnelle développée avec **React Native** et **Expo** (TypeScript), spécialement conçue pour apprendre et réviser le Français et l'Anglais avec traduction intégrale en Dari (دری) jusqu'au niveau **B1**.

---

## ✨ Fonctionnalités Principales

1. **Base de Données Trilingue Complète (Niveaux A1, A2 et B1)**
   - **Français** : Expressions idiomatiques, formules professionnelles et quotidiennes.
   - **Anglais** : Traduction équivalente naturelle.
   - **Dari (دری)** : Écriture authentique en alphabet perso-arabe avec alignement RTL (droite-à-gauche).
   - **Transcription Phonétique Latine** : Affichage phonétique pour faciliter la prononciation correcte du Dari.
   - **Notes grammaticales & contextuelles** pour chaque phrase.

2. **9 Thématiques de la Vie Courante & Professionnelle**
   - 🤝 Salutations & Présentations
   - ☕ Vie Quotidienne & Routine
   - 🚇 Transports & Voyages
   - 🍽️ Restaurant & Alimentation
   - 🛍️ Achats & Commerces
   - 🏥 Santé & Urgences
   - 💼 Travail & Milieu Professionnel (Entretien, e-mails, réunions)
   - 💬 Conversation & Expression d'Opinions (B1)
   - 🏠 Logement, Banque & Démarches Administratives (B1)

3. **Modes d'Apprentissage & Révision**
   - 🗂️ **Flashcards 3D avec Répétition Espacée** : Carte réversible avec animation fluide pour tester la mémoire active. Marquage en « Maîtrisé » ou « À revoir ».
   - 🏆 **Quiz & Entraînement B1** : Questions à choix multiples trilingues avec retour haptique, correction instantanée et calcul de score.
   - 📖 **Guide & Dictionnaire** : Recherche instantanée en français, anglais, dari ou phonétique avec filtres par niveau et thématique.
   - ⭐ **Favoris** : Sauvegarde hors-ligne des phrases à réviser en priorité.
   - 🔥 **Streak Quotidien** : Suivi de la régularité jour après jour.

4. **Synthèse Vocale (Audio)**
   - Écoute audio haute définition en **Français** et en **Anglais** pour chaque phrase.
   - Vitesse réglable (0.75x lente, 0.9x standard, 1.1x rapide) dans les options.

5. **Visualisation Moderne & Adaptabilité Mobile / Tablette**
   - **Design Moderne** : Palette soignée, cartes avec ombres douces, mode sombre (Dark Mode) et mode clair.
   - **Optimisation Tablette (iPad & Android Tablet)** : Détection automatique des grands écrans avec affichage **Maître-Détail** en double colonne.

---

## 🚀 Démarrage Rapide

### 1. Démarrer le serveur de développement
Dans le dossier du projet, lancez :
```bash
npx expo start
```

### 2. Tester sur votre Mobile ou Tablette (Android / iOS)
1. Installez l'application gratuite **Expo Go** depuis le Google Play Store ou l'App Store.
2. Scannez le **QR Code** affiché dans votre terminal :
   - Sur **Android** : avec l'application Expo Go.
   - Sur **iOS** : avec l'application Appareil Photo.
3. L'application se charge instantanément sur votre téléphone ou tablette !

### 3. Tester sur Navigateur Web
Pour tester sur votre ordinateur ou tablette via le navigateur :
```bash
npm run web
```

---

## 📦 Générer un fichier installable (.APK / .IPA)

Pour générer une application installable de manière autonome sur smartphone et tablette :
```bash
# Se connecter à EAS (gratuit)
npx eas login

# Configurer le projet de build
npx eas build:configure

# Générer l'APK pour Android (installable directement)
npx eas build -p android --profile preview
```
