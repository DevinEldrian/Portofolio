# KISEKI — Assets, Provenance and License

## Original authored assets
- `src/atlasScene.js`: original code-generated 3D composition of the floating landing-page overview. This is a **fantasy overview illustration rendered in real WebGL**, not a claim that Tokyo and Kyoto float in the sky.
- `src/kyotoLiving.js`, `src/japanDistricts.js`: original procedural 3D meshes, fictional shop fronts/signs, environmental props, animated NPC approximations. Current geometry is a stylized blockout transitioning toward reference-accurate GLB/photogrammetry.
- `src/pbrMaterials.js`: original offline procedural tileable base-color, normal and roughness maps used as fallback for all surfaces. These are **not photographic scans**.
- `src/railCinematic.js`: original simplified train interior and animated story sequence, not a real branded rolling-stock replica.

## Public-domain rigged humanoid asset (actual game model)

- File: `public/models/quaternius-human-cc0.glb` (698,560 bytes; real glTF binary v2)
- Original model: Quaternius CC0 game-ready humanoid; official pack: https://quaternius.com/packs/universalbasecharacters.html
- Redistributed rigged/animated source and preparation metadata: https://github.com/UMRAM-Bilkent/supine-human-model/tree/main/assets and repository license.
- License: CC0 1.0; check `UMRAM-Bilkent/supine-human-model/LICENSE` and original author Quaternius.
- Import: dedicated verified GitHub Actions feature-branch importer `.github/workflows/import-cc0-avatar.yml`, validates `glTF` magic, v2 length and known source size before commit.
- Renderer: `src/riggedCharacter.js` with `GLTFLoader`, `AnimationMixer`, proportional normalization to a 1.75m human and idle/walk/run blending.
- IMPORTANT: game-ready rigged character is a substantial upgrade over procedural heads, but is not a photorealistic bespoke high-detail human. Further external professionally licensed character work requires Bos art approval.

## Public-domain photogrammetry textures
A few material families **attempt to load CC0 photo-scanned PBR images at runtime** from Poly Haven over HTTPS. When an asset cannot be fetched or a browser blocks cross-origin use, KISEKI keeps the original procedural PBR fallback; it must not crash or appear textureless.

| Material family | Poly Haven asset | File type | License |
| --- | --- | --- | --- |
| Stone / cobblestone | `rock_tile_floor` | 2K base-color, OpenGL normal, ARM | CC0 |
| Weathered wood | `wood_plank_wall` | 2K base-color, OpenGL normal, ARM | CC0 |
| Paving stone | `worn_patterned_pavers` | 2K base-color, OpenGL normal, ARM | CC0 |

Canonical source: https://polyhaven.com/  
License: https://polyhaven.com/license (CC0; commercial use permitted).  
Runtime CDN paths are in `src/pbrMaterials.js`. Availability and loading on each browser are subject to network conditions and remain to be measured individually.

## Accuracy and brand policy
- No licensed anime posters, train logos or copyrighted commercial brands are intentionally imported. Neon signs are original/fictitious or generic cultural words.
- PLATEAU, OSM, geographic survey data and 4K/8K licensed scans are **not yet imported**. This art pass does **not** meet the PDF brief's Tier A/B building accuracy measurements or final 1:1 400m+ geographic worlds.
- Third-party photographs shown in the Bos-approved reference images are **not flattened onto the 3D world** and are not redistributed as production textures.
- All new external assets must be documented here with title, author/license, URL, retrieval date and intended use before production inclusion.

## Release quality boundaries
- A green JS build or Playwright smoke means the basic software ran, not that it equals the cinematic photoreal concept art.
- Final visual acceptance requires real device footage/screenshots, verified PBR texture downloads, approved licensed character GLBs and building models, playability and documented per-zone performance.
