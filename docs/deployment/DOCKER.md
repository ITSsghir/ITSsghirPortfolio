# Configuration Docker pour Portfolio

Ce projet utilise Docker et Docker Compose pour containeriser l'application portfolio complète.

## Architecture

- **Frontend** : HTML/CSS/JS statique servi par Nginx (Port 8080)
- **Backend** : Node.js + Express API (Port 3000)

## Prérequis

- Docker
- Docker Compose

## Démarrage rapide

### 1. Construire et démarrer tous les services

```bash
docker-compose up --build
```

### 2. Démarrer en arrière-plan

```bash
docker-compose up -d --build
```

### 3. Arrêter les services

```bash
docker-compose down
```

### 4. Arrêter et supprimer les volumes

```bash
docker-compose down -v
```

## Accès aux services

### Développement local
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:3000

### Production via Traefik
- **Frontend** : https://anas.itssghir.com
- **Backend API** : ⚠️ **INTERNE SEULEMENT** - Accessible uniquement par le frontend via le réseau Docker

## Commandes utiles

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Redémarrer un service

```bash
docker-compose restart frontend
docker-compose restart backend
```

### Construire uniquement un service

```bash
docker-compose build frontend
docker-compose build backend
```

### Exécuter des commandes dans un conteneur

```bash
# Accéder au shell du conteneur backend
docker-compose exec backend sh

# Accéder au shell du conteneur frontend
docker-compose exec frontend sh
```

## Variables d'environnement

Créez un fichier `.env` à la racine du projet pour les variables d'environnement :

```env
# Backend
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here

# Frontend
VITE_API_URL=http://localhost:3000

# Traefik (si nécessaire)
CF_DNS_API_TOKEN=your_cloudflare_api_token
```

## Configuration Traefik

Le projet est configuré pour fonctionner avec Traefik et être exposé sur `anas.itssghir.com`.

### Prérequis Traefik
1. **Réseau proxy** : Le réseau `proxy` doit exister
2. **Traefik en fonctionnement** : Le service Traefik doit être actif
3. **DNS configuré** : `anas.itssghir.com` doit pointer vers votre serveur

### Configuration automatique
- **Frontend** : Accessible directement sur `https://anas.itssghir.com`
- **API Backend** : 🔒 **Sécurisé** - Accessible uniquement en interne par le frontend
- **SSL automatique** : Certificats Let's Encrypt via Cloudflare
- **Redirection HTTPS** : HTTP redirigé automatiquement vers HTTPS
- **Architecture sécurisée** : L'API n'est pas exposée publiquement

### Vérification Traefik
```bash
# Vérifier que le réseau proxy existe
docker network ls | grep proxy

# Vérifier que Traefik fonctionne
curl -k https://traefik.itssghir.com
```

## Développement

Pour le développement, vous pouvez utiliser les modes de développement locaux :

```bash
# Backend (dans /backend)
npm run dev

# Frontend (dans /frontend)  
npm run dev
```

## Production

La configuration Docker est optimisée pour la production avec :

- Nginx pour servir les fichiers statiques du frontend
- Health checks
- Utilisateur non-root pour la sécurité du backend
- Gestion des erreurs et redémarrages automatiques
- Configuration réseau privée entre services

## Architecture de Sécurité

### 🔒 Backend Sécurisé
- **Non exposé** : L'API backend n'est PAS accessible depuis Internet
- **Réseau privé** : Communication uniquement via le réseau Docker `portfolio-network`
- **Principe de moindre privilège** : Seul le frontend peut communiquer avec l'API

### 🌐 Frontend Public
- **Exposé via Traefik** : Accessible publiquement sur `https://anas.itssghir.com`
- **Proxy Nginx intégré** : Nginx redirige `/api/*` vers le backend interne
- **URLs relatives** : Le JavaScript utilise `/api/*` au lieu de `http://localhost:3000`
- **SSL/TLS** : Certificats automatiques Let's Encrypt

### 🛡️ Avantages Sécuritaires
- **Surface d'attaque réduite** : L'API n'est pas directement accessible
- **Pas de CORS complexe** : Toutes les requêtes passent par le même domaine
- **Isolation** : Le backend est isolé dans son réseau privé
- **Proxy Nginx** : Filtrage et routage sécurisé des requêtes API

### 🔄 Flux de Requête API
1. **Navigateur** → `https://anas.itssghir.com/api/chat/message`
2. **Traefik** → Redirige vers le conteneur `portfolio-frontend`
3. **Nginx** → Proxy vers `http://portfolio-backend:3000/api/chat/message`
4. **Backend** → Traite la requête et renvoie la réponse
5. **Réponse** → Remonte la chaîne jusqu'au navigateur

## Troubleshooting

### Port déjà utilisé
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :80
netstat -tulpn | grep :3000

# Modifier les ports dans docker-compose.yml si nécessaire
```

### Problèmes de cache
```bash
# Construire sans cache
docker-compose build --no-cache

# Supprimer toutes les images et reconstruire
docker system prune -a
docker-compose up --build
``` 
<svg aria-roledescription="flowchart-v2" role="graphics-document document" viewBox="-8 -8 404.0546875 456.6666564941406" style="max-width: 404.0546875px;" xmlns="http://www.w3.org/2000/svg" width="100%" id="mermaid-svg-1749741990024-cyiuv7qzg"><style>#mermaid-svg-1749741990024-cyiuv7qzg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#cccccc;}#mermaid-svg-1749741990024-cyiuv7qzg .error-icon{fill:#000000;}#mermaid-svg-1749741990024-cyiuv7qzg .error-text{fill:#ff0000;stroke:#ff0000;}#mermaid-svg-1749741990024-cyiuv7qzg .edge-thickness-normal{stroke-width:2px;}#mermaid-svg-1749741990024-cyiuv7qzg .edge-thickness-thick{stroke-width:3.5px;}#mermaid-svg-1749741990024-cyiuv7qzg .edge-pattern-solid{stroke-dasharray:0;}#mermaid-svg-1749741990024-cyiuv7qzg .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-svg-1749741990024-cyiuv7qzg .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-svg-1749741990024-cyiuv7qzg .marker{fill:#cccccc;stroke:#cccccc;}#mermaid-svg-1749741990024-cyiuv7qzg .marker.cross{stroke:#cccccc;}#mermaid-svg-1749741990024-cyiuv7qzg svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#mermaid-svg-1749741990024-cyiuv7qzg .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:#cccccc;}#mermaid-svg-1749741990024-cyiuv7qzg .cluster-label text{fill:#ffffff;}#mermaid-svg-1749741990024-cyiuv7qzg .cluster-label span,#mermaid-svg-1749741990024-cyiuv7qzg p{color:#ffffff;}#mermaid-svg-1749741990024-cyiuv7qzg .label text,#mermaid-svg-1749741990024-cyiuv7qzg span,#mermaid-svg-1749741990024-cyiuv7qzg p{fill:#cccccc;color:#cccccc;}#mermaid-svg-1749741990024-cyiuv7qzg .node rect,#mermaid-svg-1749741990024-cyiuv7qzg .node circle,#mermaid-svg-1749741990024-cyiuv7qzg .node ellipse,#mermaid-svg-1749741990024-cyiuv7qzg .node polygon,#mermaid-svg-1749741990024-cyiuv7qzg .node path{fill:#0a0a0a;stroke:#2a2a2a;stroke-width:1px;}#mermaid-svg-1749741990024-cyiuv7qzg .flowchart-label text{text-anchor:middle;}#mermaid-svg-1749741990024-cyiuv7qzg .node .label{text-align:center;}#mermaid-svg-1749741990024-cyiuv7qzg .node.clickable{cursor:pointer;}#mermaid-svg-1749741990024-cyiuv7qzg .arrowheadPath{fill:#f5f5f5;}#mermaid-svg-1749741990024-cyiuv7qzg .edgePath .path{stroke:#cccccc;stroke-width:2.0px;}#mermaid-svg-1749741990024-cyiuv7qzg .flowchart-link{stroke:#cccccc;fill:none;}#mermaid-svg-1749741990024-cyiuv7qzg .edgeLabel{background-color:#0a0a0a99;text-align:center;}#mermaid-svg-1749741990024-cyiuv7qzg .edgeLabel rect{opacity:0.5;background-color:#0a0a0a99;fill:#0a0a0a99;}#mermaid-svg-1749741990024-cyiuv7qzg .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-svg-1749741990024-cyiuv7qzg .cluster rect{fill:rgba(64, 64, 64, 0.42);stroke:#6fc3df;stroke-width:1px;}#mermaid-svg-1749741990024-cyiuv7qzg .cluster text{fill:#ffffff;}#mermaid-svg-1749741990024-cyiuv7qzg .cluster span,#mermaid-svg-1749741990024-cyiuv7qzg p{color:#ffffff;}#mermaid-svg-1749741990024-cyiuv7qzg div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:#88c0d0;border:1px solid rgba(0, 0, 0, 0);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-svg-1749741990024-cyiuv7qzg .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#cccccc;}#mermaid-svg-1749741990024-cyiuv7qzg :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g><marker orient="auto" markerHeight="12" markerWidth="12" markerUnits="userSpaceOnUse" refY="5" refX="6" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1749741990024-cyiuv7qzg_flowchart-pointEnd"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 0 L 10 5 L 0 10 z"/></marker><marker orient="auto" markerHeight="12" markerWidth="12" markerUnits="userSpaceOnUse" refY="5" refX="4.5" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1749741990024-cyiuv7qzg_flowchart-pointStart"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 5 L 10 10 L 10 0 z"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="11" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1749741990024-cyiuv7qzg_flowchart-circleEnd"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="-1" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1749741990024-cyiuv7qzg_flowchart-circleStart"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="12" viewBox="0 0 11 11" class="marker cross flowchart" id="mermaid-svg-1749741990024-cyiuv7qzg_flowchart-crossEnd"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="-1" viewBox="0 0 11 11" class="marker cross flowchart" id="mermaid-svg-1749741990024-cyiuv7qzg_flowchart-crossStart"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><g class="root"><g class="clusters"><g id="subGraph1" class="cluster default flowchart-label"><rect height="83.66666793823242" width="238.8984375" y="357.00000762939453" x="0" ry="0" rx="0" style=""/><g transform="translate(28.391921997070312, 357.00000762939453)" class="cluster-label"><foreignObject height="18.666667938232422" width="182.11459350585938"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">Réseau portfolio-network</span></div></foreignObject></g></g><g id="subGraph0" class="cluster default flowchart-label"><rect height="186.00000381469727" width="381.3307294845581" y="102.33333587646484" x="6.7239580154418945" ry="0" rx="0" style=""/><g transform="translate(149.96744775772095, 102.33333587646484)" class="cluster-label"><foreignObject height="18.666667938232422" width="94.84375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">Réseau proxy</span></div></foreignObject></g></g></g><g class="edgePaths"><path marker-end="url(#mermaid-svg-1749741990024-cyiuv7qzg_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-A LE-B" id="L-A-B-0" d="M198.555,33.667L198.555,39.389C198.555,45.111,198.555,56.556,198.555,68C198.555,79.444,198.555,90.889,198.555,99.894C198.555,108.9,198.555,115.467,198.555,118.75L198.555,122.033"/><path marker-end="url(#mermaid-svg-1749741990024-cyiuv7qzg_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-B LE-C" id="L-B-C-0" d="M223.447,161L231.909,166.722C240.371,172.444,257.295,183.889,265.757,194.45C274.219,205.011,274.219,214.689,274.219,219.528L274.219,224.367"/><path marker-end="url(#mermaid-svg-1749741990024-cyiuv7qzg_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-C LE-D" id="L-C-D-0" d="M235.429,263.333L225.828,267.5C216.226,271.667,197.023,280,187.422,289.889C177.82,299.778,177.82,311.222,177.82,322.667C177.82,334.111,177.82,345.556,171.057,355.017C164.294,364.479,150.767,371.957,144.004,375.696L137.241,379.436"/><path marker-end="url(#mermaid-svg-1749741990024-cyiuv7qzg_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-C LE-E" id="L-C-E-0" d="M296.479,263.333L301.989,267.5C307.499,271.667,318.519,280,324.029,289.889C329.539,299.778,329.539,311.222,329.539,322.667C329.539,334.111,329.539,345.556,329.539,354.561C329.539,363.567,329.539,370.133,329.539,373.417L329.539,376.7"/><path marker-end="url(#mermaid-svg-1749741990024-cyiuv7qzg_flowchart-pointEnd)" style="fill:none;stroke-width:2px;stroke-dasharray:3;" class="edge-thickness-normal edge-pattern-dotted flowchart-link LS-B LE-D" id="L-B-D-0" d="M166.336,158.193L152.117,164.383C137.898,170.573,109.459,182.953,95.24,197.671C81.021,212.389,81.021,229.444,81.021,244.944C81.021,260.444,81.021,274.389,81.021,287.083C81.021,299.778,81.021,311.222,81.021,322.667C81.021,334.111,81.021,345.556,82.728,354.656C84.434,363.756,87.848,370.513,89.555,373.891L91.262,377.269"/></g><g class="edgeLabels"><g transform="translate(198.5546875, 68.00000190734863)" class="edgeLabel"><g transform="translate(-22.83333396911621, -9.333333969116211)" class="label"><foreignObject height="18.666667938232422" width="45.66666793823242"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">HTTPS</span></div></foreignObject></g></g><g transform="translate(274.21875, 195.33333778381348)" class="edgeLabel"><g transform="translate(-61.427085876464844, -9.333333969116211)" class="label"><foreignObject height="18.666667938232422" width="122.85417175292969"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">anas.itssghir.com</span></div></foreignObject></g></g><g transform="translate(177.8203125, 322.6666736602783)" class="edgeLabel"><g transform="translate(-22.27083396911621, -9.333333969116211)" class="label"><foreignObject height="18.666667938232422" width="44.54166793823242"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">/api/*</span></div></foreignObject></g></g><g transform="translate(329.5390625, 322.6666736602783)" class="edgeLabel"><g transform="translate(-39.489585876464844, -9.333333969116211)" class="label"><foreignObject height="18.666667938232422" width="78.97917175292969"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">Static Files</span></div></foreignObject></g></g><g transform="translate(81.0208330154419, 246.5000057220459)" class="edgeLabel"><g transform="translate(-54.296875, -10.666666984558105)" class="label"><foreignObject height="21.33333396911621" width="108.59375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="edgeLabel">❌ Non exposé</span></div></foreignObject></g></g></g><g class="nodes"><g transform="translate(102.15625, 398.83334159851074)" id="flowchart-D-21" class="node default default flowchart-label"><rect height="33.66666793823242" width="134.3125" y="-16.83333396911621" x="-67.15625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-59.65625, -9.333333969116211)" style="" class="label"><rect/><foreignObject height="18.666667938232422" width="119.3125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">Backend Node.js</span></div></foreignObject></g></g><g transform="translate(198.5546875, 144.16666984558105)" id="flowchart-B-17" class="node default default flowchart-label"><rect height="33.66666793823242" width="64.4375" y="-16.83333396911621" x="-32.21875" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-24.71875, -9.333333969116211)" style="" class="label"><rect/><foreignObject height="18.666667938232422" width="49.4375"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">Traefik</span></div></foreignObject></g></g><g transform="translate(274.21875, 246.5000057220459)" id="flowchart-C-19" class="node default default flowchart-label"><rect height="33.66666793823242" width="124.0625" y="-16.83333396911621" x="-62.03125" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-54.53125, -9.333333969116211)" style="" class="label"><rect/><foreignObject height="18.666667938232422" width="109.0625"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">Frontend Nginx</span></div></foreignObject></g></g><g transform="translate(198.5546875, 16.83333396911621)" id="flowchart-A-16" class="node default default flowchart-label"><rect height="33.66666793823242" width="92.48958587646484" y="-16.83333396911621" x="-46.24479293823242" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-38.74479293823242, -9.333333969116211)" style="" class="label"><rect/><foreignObject height="18.666667938232422" width="77.48958587646484"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">Navigateur</span></div></foreignObject></g></g><g transform="translate(329.5390625, 398.83334159851074)" id="flowchart-E-23" class="node default default flowchart-label"><rect height="33.66666793823242" width="111.28125" y="-16.83333396911621" x="-55.640625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(-48.140625, -9.333333969116211)" style="" class="label"><rect/><foreignObject height="18.666667938232422" width="96.28125"><div style="display: inline-block; white-space: nowrap;" xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">HTML/CSS/JS</span></div></foreignObject></g></g></g></g></g></svg>