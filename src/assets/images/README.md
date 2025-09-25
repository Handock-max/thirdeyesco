# Dossier Images - Third Eyes Co.

Ce dossier contient toutes les images utilisées sur le site web Third Eyes Co.

## Structure recommandée

```
src/assets/images/
├── logos/                    # Logos et marques
│   ├── third-eyes-logo.png  # Logo principal (déjà présent)
│   ├── logo-dark.png        # Logo pour thème sombre
│   └── logo-light.png       # Logo pour thème clair
├── formations/              # Images liées aux formations
│   ├── data-science.jpg     # Image pour formation Data Science
│   ├── intelligence-artificielle.jpg
│   └── formations-hero.jpg  # Image principale des formations
├── team/                    # Photos de l'équipe
│   ├── formateur-principal.jpg
│   └── equipe.jpg
├── backgrounds/             # Images de fond
│   ├── hero-background.jpg
│   └── pattern.svg
└── icons/                   # Icônes personnalisées
    ├── brain-icon.svg
    └── data-icon.svg
```

## Instructions d'utilisation

1. **Logos** : Placez vos logos dans le dossier `logos/`
2. **Images de formations** : Ajoutez des images représentatives dans `formations/`
3. **Photos d'équipe** : Mettez les photos de l'équipe dans `team/`
4. **Images de fond** : Stockez les backgrounds dans `backgrounds/`

## Formats recommandés

- **PNG** : Pour les logos et icônes avec transparence
- **JPG** : Pour les photos et images complexes
- **SVG** : Pour les icônes vectorielles
- **WebP** : Pour les images optimisées (recommandé)

## Optimisation

- Compressez les images avant de les ajouter
- Utilisez des tailles appropriées (max 1920px de largeur)
- Nommez les fichiers de manière descriptive

## Références dans le code

Les images sont importées et utilisées comme ceci :

```typescript
// Import d'une image
import logoImage from '@/assets/images/logos/third-eyes-logo.png';

// Utilisation dans le JSX
<img src={logoImage} alt="Third Eyes Co. Logo" />
```
