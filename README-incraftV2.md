# incraftV2 — Launcher Minecraft custom

Launcher Minecraft cross‑platform construit avec **Electron + Vite + Vue 3**, intégrant login Microsoft, lancement du client via `minecraft-launcher-core`, gestion de profils, persistance et auto‑update.

## 🚀 Stack
- Electron + electron‑builder (packaging)
- Vite (dev/build rapide)
- Vue 3 + Vue Router + Pinia
- electron‑store (persistance locale)
- electron‑updater (MAJ auto)
- minecraft‑launcher‑core (lancement)
- msmc (auth Microsoft)
- axios, nodejs‑file‑downloader, unzipper, tomate‑loaders

## ✨ Fonctionnalités
- UI Vue 3 moderne avec router et state global (Pinia)
- Login Microsoft (msmc)
- Lancement du client Minecraft (minecraft‑launcher‑core)
- Téléchargements d’assets/libs (axios + downloader)
- Logs du jeu intégrés dans l’UI
- Sauvegarde des préférences (electron‑store)
- Auto‑update (electron‑updater)

## 📂 Structure
```
incraftV2/
  src/
    main/      # Process principal Electron (fenêtres, IPC, updater)
    preload/   # Bridges sécurisés
    renderer/  # UI Vue 3 (components, store Pinia, routes)
  out/         # Build output
  package.json
```

## 🛠️ Scripts
```bash
npm run dev        # mode dev live‑reload
npm start          # preview packagé léger
npm run build:win     # build Windows
npm run build:mac     # build macOS
npm run build:linux   # build Linux
```

## 🔒 Sécurité
- `contextIsolation` + preload sécurisé
- IPC restreint (exposer uniquement API nécessaires)
- Pas de secrets commités (utiliser .env)

## ⚖️ Légal
- Projet personnel/pédagogique
- Licence Minecraft valide requise
- Respect de l’EULA Mojang/Microsoft

## 🛣️ Roadmap
- [ ] UI login complète OAuth Microsoft
- [ ] Gestion mods (Forge/Fabric)
- [ ] Paramètres avancés (RAM, JVM args)
- [ ] Vérification d’intégrité (hash)

## 📜 Licence
MIT
