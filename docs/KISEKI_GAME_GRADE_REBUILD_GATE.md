# KISEKI — Game-Grade 3D Reconstruction Gate (Bos rejection, 2026-10-08)

**State: REBUILD / RELEASE NO-GO.** Bos explicitly rejected PR #7: uncanny blocky avatar, toy-small scenes, non-game-grade graphics, bugs and mismatch with the actual brief. A green build never means graphics are approved.

## Design authority
1. `Template Brief CV 3D Open-World Jepang (4 Kota + Kereta)` §§1–18: **Akihabara → Shibuya → Arashiyama Bamboo Forest → Kyoto**, third-person human, train cabin, CV interactions, photorealistic PBR.
2. X1 `docs/KISEKI_X1_LIVING_JAPAN_DESIGN_REVISION.md` v2.2: primary **Randen Arashiyama** spawn → Nagatsuji-dori-like shops → Katsura River/Togetsukyo → Bamboo Grove. Bridge concrete piers with cypress parapets, **not** all-wood toy bridge. Use actual documented landmarks.
3. `docs/JAPAN_RAIL_DESIGN_HANDOFF.md`: no floating islands or isolated dioramas **as playable locations**. Cinematic overview remains optional, never a substitute for real cities.
4. All CV data must remain visible in keyboard-accessible HTML Quick View with no WebGL dependency; employer data must stay confidential.

## Realistic grading
| Gate | Required proof | Current PR #8 |
| --- | --- | --- |
| Player | Approved licensed 1.75m humanoid GLB, animation mixer idle/walk/run, plausible face, no clipping, foot IK & train poses | CC0 Quaternius rig imported/normalised; animations load in Chromium. **Face/costume visual review and foot IK outstanding.** |
| Playable scale | 400m radius or denser geographically correct corridor per city with Tier A landmark references; no cliff or empty edge | New 520m envelope / 540m Arashiyama terrain. **Still under final 400m radius and not geo-surveyed.** |
| Photographic materials | Audited CC0/purchased 2K–4K+ albedo/normal/rough/metal/AO; shader and lighting validated under rain/sun/night | PBR plus 2K CC0 texture streaming with fallback; many façades still procedural. |
| Akihabara | Real district silhouette: Electric Town Exit, Chuo-dori, shop mix, vending/gacha, original anime-inspired retail graphic design, moving humans | Added contiguous Tokyo block scale and detailed retail props; **reference-accurate landmarks outstanding.** |
| Shibuya | Hachiko exit, QFRONT-like massing, scramble stripes and pedestrian/vehicle signal timing, 40+ varied human walkers | Existing scramble and crowd layout, district expansion; **real signal/traffic timing outstanding.** |
| Arashiyama | Randen / Kimono-Forest-inspired area, shops, bridge/Katsura, enclosed bamboo paths, boats/wind/ambience; rich human routines | Existing core plus >1K extra bamboo and valley extension; **bridge construction/photo matching outstanding.** |
| Kyoto | Gion-Hanamikoji / Ninenzaka, machiya/sloped ceramic roofs, original signage, warm lanterns and a pagoda skyline | Expanded original geometric props; **real surveyed façades/material detail outstanding.** |
| Rails | Distinct correct station per district, 3D board → inside fully modeled cabin → view → arrival → exit, Skip/Esc/recovery | Cinematic 3D cabin phases and tests; **doors/seating/true per-station service routing outstanding.** |
| QA | Independently visually review actual Chrome GPU / Android/iOS; collision, loading, assets, visible landmarks, screenshots, FPS, memory | GitHub Actions browser smoke (software GPU), real rig status and movement; **not hardware GPU QA.** |

## Asset acquisition and hard restrictions
- `public/models/quaternius-human-cc0.glb` sourced and committed from `UMRAM-Bilkent/supine-human-model` under its CC0 Quaternius attribution (source verified original 698,560-byte glTF v2). No proprietary Mixamo assets.
- CC0 photogrammetry PBR from Poly Haven (see `CREDITS.md`), fail gracefully offline. Higher-res material/GLB import requires exact asset URL, license, download hash and quality screenshots before inclusion.
- Future PLATEAU/GSI/OSM geometry must be licensed and checked against real Japanese geography; do not claim Tier A 100% accuracy without IoU/facade surveys.
- Anime adverts must be **original fictional designs** without copyrighted characters/brand logos.
- Do **not** release, auto-merge, or deploy `main` until Bos personally approves true game-grade visual compare screenshots from actual running WebGL.
- Vercel preview currently cannot be published at this branch's newest head due to deployment build rate limit. CI artifacts remain evidence. Never label an old preview as this build.

## Next art backlog in priority order
1. **Asset-first** Arashiyama P0: photogrammetry-backed machiya front, modernized Randen station / train, realistic bridge supports, original kimono textile columns, verified photos for comparison.
2. Finish properly skinned, clothed and foot-IK human avatar, then repeat for a real small NPC cast.
3. Correct Tokyo street references (Akihabara / Shibuya as separate zones) and add actual traffic loops and environmental audio.
4. Build playable rail-route station-to-station transfers with correct real JR changes and intermediate ride pacing.
5. Final four-district recognition in screenshots, GPU telemetry, verified CV content; only then Bos release discussion.
