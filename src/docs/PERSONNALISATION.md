# 📚 Guide de Personnalisation - Third Eyes Co.

## 🎯 Configuration Rapide

### 1. Informations de base
Modifiez le fichier `src/config/formations.ts` pour personnaliser :

```typescript
export const COMPANY_CONFIG = {
  nom: "Votre Entreprise", // CHANGEZ ICI
  whatsappNumber: "+22500000000", // VOTRE NUMÉRO WHATSAPP
  email: "contact@votre-domaine.com", // VOTRE EMAIL
  
  tagline: "Votre slogan formation",
  description: "Votre description personnalisée..."
};
```

### 2. Formations et Prix
Dans le même fichier, ajustez les formations selon vos besoins :

```typescript
export const FORMATIONS_CONFIG = {
  individuelle: [
    { 
      id: 'votre-formation', 
      nom: 'Votre Formation (X jours)', 
      prix: 50000, // PRIX EN FCFA
      description: 'Description de votre formation'
    }
  ]
  // ... autres formations
};
```

## 🎨 Personnalisation Visuelle

### Couleurs et Design
Modifiez le fichier `src/index.css` pour changer les couleurs :

```css
:root {
  /* Changez ces couleurs selon votre charte graphique */
  --primary: 240 100% 70%; /* Couleur principale */
  --primary-glow: 260 100% 75%; /* Couleur secondaire */
  --background: 220 26% 14%; /* Arrière-plan */
}
```

### Logo de l'entreprise
Remplacez le fichier `src/assets/third-eyes-logo.png` par votre propre logo.

## 📋 Fonctionnalités Principales

### ✅ Déjà implémenté
- ✅ Design moderne avec glassmorphism
- ✅ Formulaire multi-étapes avec validation
- ✅ Calcul automatique des prix
- ✅ Animations fluides et effets visuels
- ✅ Responsive design (mobile/desktop)
- ✅ Logo en arrière-plan flouté
- ✅ Bouton clignotant "Je m'inscris"
- ✅ Intégration WhatsApp
- ✅ Messages de confirmation

### 📝 Structure du Formulaire
1. **Page 1** : Informations personnelles
2. **Page 2** : Sélection formation avec prix automatique
3. **Page 3** : Modalités et motivation
4. **Page 4** : Confirmation et conditions

## 🔧 Personnalisations Avancées

### Ajouter des validations
Dans `src/config/formations.ts`, modifiez :

```typescript
export const VALIDATION_RULES = {
  nomComplet: {
    minLength: 2,
    maxLength: 100,
    required: true
  }
  // Ajoutez vos règles ici
};
```

### Modifier les centres d'intérêt
```typescript
export const CENTRES_INTERET = [
  'Votre domaine 1',
  'Votre domaine 2',
  // ... ajoutez selon vos formations
];
```

### Personnaliser les messages
```typescript
export const MESSAGES = {
  welcome: {
    titre: "Votre message d'accueil",
    description: "Votre description...",
    cta: "Votre bouton CTA"
  }
};
```

## 🗄️ Connexion Base de Données

### Pour sauvegarder les inscriptions :
1. **Cliquez sur le bouton Supabase** (vert, en haut à droite)
2. **Connectez votre projet Supabase**
3. L'application créera automatiquement la table nécessaire

### Structure de la table créée :
```sql
CREATE TABLE inscriptions_formation (
  id UUID PRIMARY KEY,
  nom_complet TEXT,
  email TEXT,
  telephone TEXT,
  ville TEXT,
  type_formation TEXT,
  formation_specifique TEXT,
  prix INTEGER,
  mode_formation TEXT,
  motivation TEXT,
  centres_interet TEXT[],
  date_inscription TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Points Importants

### ⚠️ À Modifier Obligatoirement
1. **Numéro WhatsApp** dans `COMPANY_CONFIG.whatsappNumber`
2. **Formations et prix** selon votre offre réelle
3. **Logo** - remplacez par le vôtre
4. **Informations entreprise** (nom, email, etc.)

### ✨ Commentaires dans le Code
- Tous les commentaires sont en français
- Parties à compléter marquées avec `// TODO` et `// MODIFIER`
- Variables importantes commentées explicitement

## 🚀 Prochaines Étapes

### 1. Test complet
- Testez le formulaire sur mobile et desktop
- Vérifiez que le numéro WhatsApp fonctionne
- Testez tous les types de formations

### 2. Optimisations possibles
- Ajouter Google Analytics pour tracking
- Intégrer un système de paiement (Stripe)
- Ajouter un système d'email automatique
- Créer un dashboard admin pour voir les inscriptions

### 3. SEO et Marketing
- L'application est déjà optimisée SEO
- Métadonnées configurées pour réseaux sociaux
- Structure HTML sémantique

## 📞 Support
- Modifiez directement les fichiers de configuration
- Tous les styles sont dans le design system
- Code commenté pour faciliter la maintenance

---

**🎉 Votre application d'inscription est prête !**

N'oubliez pas de connecter Supabase pour sauvegarder les inscriptions.