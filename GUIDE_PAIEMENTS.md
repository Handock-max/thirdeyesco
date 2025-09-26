# 📱 Guide des Paiements Mobiles - Third Eyes Co.

Ce guide vous explique comment fonctionne le système de paiement mobile que j'ai créé pour votre site.

## 🎯 Fonctionnalités Implémentées

### ✅ Ce qui a été ajouté :

1. **Détection mobile/desktop** - Le système s'adapte automatiquement
2. **Options de paiement** - Total ou frais d'inscription seulement
3. **Intégration Flooz/Mixx** - Avec logos et codes USSD
4. **Notifications Slack** - Alertes automatiques pour chaque inscription/paiement
5. **Favicon** - Logo Third Eyes Co. dans l'onglet du navigateur
6. **Fallback localStorage** - Sauvegarde locale si Supabase ne fonctionne pas

## 🔧 Comment ça fonctionne

### Sur Mobile 📱
1. L'utilisateur remplit le formulaire
2. **NOUVEAU**: Après validation, il voit les options de paiement
3. Il choisit : "Payer tout" ou "Frais d'inscription seulement"
4. Il sélectionne Flooz ou Mixx
5. L'app génère le code USSD et ouvre l'app téléphone
6. Après paiement, il revient sur le site avec un message de confirmation

### Sur Desktop 💻
1. L'utilisateur remplit le formulaire
2. Pas d'options de paiement (comme demandé)
3. Message d'inscription réussie directement
4. Les numéros de paiement sont affichés si besoin

## 📋 Configuration Requise

### 1. Slack Webhook (IMPORTANT)
```bash
# Dans votre fichier .env, ajoutez :
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/VOTRE/WEBHOOK/URL
```

**Comment obtenir l'URL Slack :**
1. Allez sur https://api.slack.com/apps
2. Créez une nouvelle app Slack
3. Activez "Incoming Webhooks"
4. Créez un webhook pour votre canal #inscriptions
5. Copiez l'URL dans votre .env

### 2. Numéros de Paiement
Les numéros sont déjà configurés dans `src/config/payment.ts` :
- **Flooz**: 96933995
- **Mixx**: 92448233

Pour les modifier, éditez le fichier `src/config/payment.ts`.

### 3. Codes USSD
Les codes sont automatiquement générés :
- **Flooz**: `*155*1*1*96933995*96933995*MONTANT#`
- **Mixx**: `*145*1*MONTANT*92448233*2#`

## 🎨 Personnalisation Facile

### Modifier les Messages
Éditez `src/config/payment.ts` :
```typescript
MESSAGES: {
  TITRE_PAIEMENT: "Votre nouveau titre",
  DESCRIPTION_PAIEMENT: "Votre nouvelle description",
  // ... autres messages
}
```

### Modifier les Numéros
```typescript
PAYMENT_CONFIG: {
  FLOOZ_NUMBER: "VOTRE_NUMERO_FLOOZ",
  MIXX_NUMBER: "VOTRE_NUMERO_MIXX",
  // ...
}
```

### Modifier le Montant des Frais d'Inscription
```typescript
FRAIS_INSCRIPTION_MONTANT: 5000, // 5 000 FCFA pour toutes les formations
```

## 🔄 Flux Complet

### 1. Inscription
```
Utilisateur remplit formulaire 
→ Données envoyées à Supabase 
→ Notification Slack "Nouvelle inscription"
→ [Mobile] Options de paiement affichées
→ [Desktop] Message de succès direct
```

### 2. Paiement (Mobile uniquement)
```
Utilisateur choisit option (total/frais)
→ Sélectionne opérateur (Flooz/Mixx)
→ Code USSD généré et app téléphone ouverte
→ Notification Slack "Tentative de paiement"
→ Message de confirmation affiché
```

## 📱 Messages Slack Automatiques

### Nouvelle Inscription
```
🎓 Nouvelle inscription Third Eyes Co.
Nom: Martin Akashi
Email: martin@example.com
Téléphone: +225 XX XX XX XX
Formation: Data Débutant (2 jours)
Prix: 25,000 FCFA
```

### Tentative de Paiement
```
💳 Tentative de paiement
Nom: Martin Akashi
Téléphone: +225 XX XX XX XX
Type: Paiement total (FLOOZ)
Montant: 25,000 FCFA

⏰ Action requise: Contacter dans 15 min
📞 Téléphone: +225 XX XX XX XX
📧 Email: martin@example.com
```

## 🛠️ Fichiers Créés/Modifiés

### Nouveaux Fichiers
- `src/config/payment.ts` - Configuration des paiements
- `src/lib/slack.ts` - Service de notifications Slack
- `src/components/PaymentOptions.tsx` - Interface de paiement
- `supabase-setup.sql` - Script de création de table
- `GUIDE_PAIEMENTS.md` - Ce guide

### Fichiers Modifiés
- `src/components/FormationInscription.tsx` - Intégration paiements
- `index.html` - Ajout du favicon
- `.env` - Variables d'environnement Slack

## 🧪 Tests

### Tester Slack
```typescript
import { testerSlack } from '@/lib/slack';

// Dans la console du navigateur
testerSlack().then(result => console.log('Test Slack:', result));
```

### Tester Détection Mobile
```typescript
import { PaymentUtils } from '@/config/payment';

console.log('Est mobile:', PaymentUtils.estSurMobile());
```

## 🚨 Points d'Attention

1. **URL Slack** - OBLIGATOIRE pour les notifications
2. **Logos** - Vérifiez que flooz.png et mixx.png sont bien dans `/src/assets/images/`
3. **Numéros** - Vérifiez que les numéros Flooz/Mixx sont corrects
4. **Date formation** - Actuellement fixée au 15/10/2025 dans les disclaimers

## 📞 Support

Si vous avez des questions ou voulez modifier quelque chose :
1. Tous les textes sont dans `src/config/payment.ts`
2. La logique de paiement est dans `src/components/PaymentOptions.tsx`
3. Les notifications Slack sont dans `src/lib/slack.ts`

**Chaque fichier est très bien commenté pour vous aider à comprendre et modifier facilement !** 🎓