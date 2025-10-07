# 🎯 Third Eyes Co. - Plateforme de Formation Data Science & IA

> **Formations professionnelles en Data Science et Intelligence Artificielle**  
> Développez vos compétences avec nos programmes conçus pour l'économie numérique.

[![Deploy to GitHub Pages](https://github.com/your-username/thirdeyesco/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/thirdeyesco/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-blue.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)

## ✨ Fonctionnalités

- 🎨 **Design moderne** avec thème clair/sombre
- 📱 **Responsive** - Optimisé pour tous les appareils
- 📝 **Formulaire d'inscription** multi-étapes intuitif
- 🗄️ **Base de données** Supabase intégrée
- 🚀 **Déploiement automatique** sur GitHub Pages
- ⚡ **Performance optimisée** avec Vite et React
- 🎯 **UX/UI soignée** avec animations et transitions

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase
- Compte GitHub

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/your-username/thirdeyesco.git
   cd thirdeyesco
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Supabase**
   - Créez un projet sur [Supabase](https://supabase.com)
   - Copiez `env.example` vers `.env`
   - Remplissez vos clés Supabase

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:8080
   ```

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run build:github     # Build optimisé pour GitHub Pages
npm run preview          # Preview du build local
npm run preview:github   # Preview avec base GitHub Pages

# Qualité du code
npm run lint             # Vérification ESLint
```

## 🏗️ Architecture

### Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Build** : Vite
- **Base de données** : Supabase
- **Déploiement** : GitHub Pages + GitHub Actions
- **Thème** : Système de thème clair/sombre personnalisé

### Structure du projet

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants UI de base
│   ├── WelcomePage.tsx # Page d'accueil
│   └── FormationInscription.tsx # Formulaire
├── contexts/           # Contextes React
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires
├── pages/              # Pages de l'application
└── assets/             # Ressources statiques
```

## 🎨 Personnalisation

### Modifier les formations

Éditez `src/components/FormationInscription.tsx` :

```typescript
const FORMATIONS_CONFIG = {
  individuelle: [
    { id: 'data-debutant', nom: 'Data Débutant (2 jours)', prix: 25000 },
    // Ajoutez vos formations
  ],
  // ...
};
```

### Modifier les couleurs

Éditez `src/index.css` :

```css
:root {
  --primary: 240 100% 60%; /* Votre couleur principale */
}
```

### Ajouter des images

1. Placez vos images dans `src/assets/images/`
2. Importez-les dans vos composants
3. Référencez-les dans le code

## 🚀 Déploiement

### GitHub Pages (automatique)

1. Poussez votre code sur GitHub
2. Allez dans **Settings > Pages**
3. Sélectionnez **GitHub Actions**
4. Le déploiement se fait automatiquement

### Déploiement manuel

```bash
npm run build:github
# Uploadez le dossier dist/ sur votre serveur
```

## 📊 Base de données

### Configuration Supabase

1. Créez un projet Supabase
2. Exécutez le script SQL fourni dans la documentation
3. Configurez les variables d'environnement

### Structure de la table

```sql
CREATE TABLE inscriptions (
  id UUID PRIMARY KEY,
  nom_complet VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(50) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  type_formation VARCHAR(20) NOT NULL,
  formation_specifique VARCHAR(255) NOT NULL,
  prix INTEGER NOT NULL,
  mode_formation VARCHAR(20) NOT NULL,
  motivation TEXT NOT NULL,
  centres_interet TEXT[] DEFAULT '{}',
  accepte_conditions BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Configuration avancée

### Variables d'environnement

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WHATSAPP_NUMBER=+22500000000
VITE_CONTACT_EMAIL=contact@thirdeyesco.com
```

### Thème personnalisé

Le système de thème supporte :
- Thème clair
- Thème sombre  
- Thème système (suit les préférences OS)

## 📱 Responsive Design

Le site est optimisé pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎯 Fonctionnalités du formulaire

- ✅ **Validation en temps réel**
- 📊 **Barre de progression**
- 💾 **Sauvegarde automatique** (Supabase)
- 📱 **Design responsive**
- 🎨 **Animations fluides**
- 🔄 **Gestion d'erreurs**

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- 📧 Email : martindetours98.com
- 💬 WhatsApp : +22896933995
- 🐛 Issues : [GitHub Issues](https://github.com/your-username/thirdeyesco/issues)

## 🙏 Ressources

- [React](https://reactjs.org/) - Framework JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Lucide React](https://lucide.dev/) - Icônes

---

**Développé avec ❤️ pour Third Eyes Co.**

*Transformez votre carrière avec nos formations en Data Science et IA*
