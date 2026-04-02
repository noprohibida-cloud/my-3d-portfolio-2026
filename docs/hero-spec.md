# Section Hero — Direction artistique

> Document de consigne pour l'IA. Aucun code. Respecter strictement ces directives.

---

## Ce qu'est le Hero

Le Hero est la première chose que voit le visiteur. Il occupe toute la hauteur de l'écran. Il se compose de deux couches superposées : un fond animé procédural et un texte positionné sur la moitié gauche de l'écran.

---

## Le fond animé — shader VT220 ASCII/CRT

Le fond du Hero n'est plus l'attracteur de Clifford ni le Lorenz. On abandonne définitivement ces approches. Le fond est désormais un shader de type **VT220 ASCII/CRT** : des caractères ASCII animés qui forment des silhouettes organiques sur un fond violet profond tirant vers le magenta.

Ce shader est chargé via une iframe plein écran, positionnée en arrière-plan derrière tout le contenu textuel. Il ne capte aucune interaction de la souris — il est purement décoratif et procédural.

La palette du shader :
- Fond : violet profond, entre `#0d0010` et `#1a0020`
- Caractères : blanc cassé, presque blanc
- Halo / glow : magenta diffus autour des silhouettes
- Zones sombres intérieures : quasi-noir

Ce shader doit être autonome, sans dépendance externe, et fonctionner dans une iframe isolée du reste du DOM.

---

## Le texte du Hero

Le texte occupe la moitié gauche de l'écran sur desktop, centré verticalement. Sur mobile, il est aligné en haut avec un padding supérieur généreux. Il est toujours devant le shader — jamais en dessous.

### Les trois éléments textuels

**Ligne 1 — accroche** : "Hi, I am" — petite taille, fin, couleur grise neutre désaturée. Discret, introductif.

**Ligne 2 — nom** : "hugo traver" — très grand, ultra-fin (weight 100), en effet *outline* : le texte est transparent, seul le contour est visible. C'est la signature visuelle centrale du Hero. Ne jamais remplir ce texte en blanc plein.

**Ligne 3 — sous-titre** : un texte qui morphe en boucle entre quatre qualificatifs : *designer interactif*, *technical artist*, *développeur créatif*, *directeur artistique*. Taille intermédiaire, fin, gris neutre. Le morphing est lent et fluide — pas saccadé.

### Apparition au chargement

Les trois éléments apparaissent avec un léger effet de flou qui se dissipe, chacun à son tour avec un petit décalage. Ils n'apparaissent qu'une fois le preloader terminé.

---

## Palette du Hero côté texte

- Fond HTML/CSS : transparent — c'est le shader qui fournit la couleur de fond
- Texte accroche et sous-titre : gris neutre, légèrement transparent
- Nom (h1) : transparent avec contour blanc — effet outline
- Aucune couleur d'accent dans le Hero — pas de jaune, pas d'orange ici

---

## Règles absolues à ne jamais enfreindre

1. Le fond HTML, le body, le main, et la section Hero restent transparents — toute couleur de fond CSS masquerait le shader.
2. Le shader reste en arrière-plan absolu, sans pointer-events.
3. Le nom reste en effet outline (transparent + contour) — ne jamais le passer en couleur pleine.
4. Le weight du texte reste ultra-fin (100) sur le nom et le sous-titre.
5. La moitié droite de l'écran reste vide sur desktop — elle est réservée au clavier 3D Spline qui s'y superpose.
6. Ne jamais introduire de carte, de fond coloré, ou d'élément décoratif supplémentaire dans le Hero.
