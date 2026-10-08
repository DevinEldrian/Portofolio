# Japan — Beyond the Rails | Design Handoff v2.1

**Owner:** UI/UX Director  
**PM:** Agent Z  
**Implementation:** Agent XO  
**QA:** Agent T1  
**Status:** APPROVED ART DIRECTION / awaiting feasibility and prototype review

## Creative vision
Build a cinematic, third-person *Japan-inspired open-region* personal CV portfolio with a **human avatar** and **rail-station-based travel**. All professional content must remain readable in an HTML Quick View without needing game traversal. This supersedes the earlier tiny floating-island / low-poly diorama direction.

**Visual priorities:** cinematic stylized realism, geographically recognizable landscapes and architecture, believable scale, PBR materials, atmospheric lighting and weather, strong regional identity. Avoid generic pagodas, random landmarks, toy-like environments and impossible train routing.

## Seven place-specific regions

| World | Region / reference | Signature environment | Real arrival/transfer | Portfolio role |
|---|---|---|---|---|
| 01 | Tokyo / Shinjuku | Dense skyscrapers, neon streets, rain reflections, public activity | Shinjuku Station | Landing, intro, central rail map |
| 02 | Kyoto / Arashiyama | Katsura river, Togetsukyo bridge, Sagano bamboo, traditional town foothills | Saga-Arashiyama or Randen Arashiyama | Projects and case studies |
| 03 | Yamanashi / Kawaguchiko | Lake, Mt Fuji, maple trees, low townscape | Kawaguchiko Station | Skills and tech |
| 04 | Yamagata / Ginzan Onsen | River valley, Taisho-style multi-story ryokan, gas lamps, steam, snow | **Oishida Station + onward road transfer**, not rail into Ginzan | Experience & timeline |
| 05 | Hokkaido / Biei & Furano | Patchwork hills, lavender fields, farms, Tokachidake distance | Biei / Furano stations, attractions separated geographically | Achievements, experiments |
| 06 | Wakayama / Koyasan | Sacred forest, cedar trees, temple town, lantern footpaths | **Gokurakubashi rail + cable car**, not direct rail to temples | Values/philosophy |
| 07 | Hiroshima / Miyajima | Seto Inland Sea, tide-level torii, coast, forested island, harbor | **Miyajimaguchi rail + ferry**, no island rail station | Contact, finale |

**Official visual research:**
- https://www.japan.travel/en/destinations/kanto/tokyo/shinjuku/
- https://www.japan.travel/en/spot/1142/
- https://www.japan.travel/en/spot/1329/
- https://www.japan.travel/en/spot/1798/
- https://www.japan.travel/en/spot/1867/
- https://www.japan.travel/en/itineraries/a-spiritual-journey-through-sacred-mountains/
- https://www.japan.travel/en/world-heritage/itsukushima-shinto-shrine/

Use real-world reference where practical but clearly mark fictional distances, compressed geography, and any invented rail links as artistic interpretation.

## Scale and exploration
Target a **meaningful 1–2 km walkable corridor or district envelope per complete region** with distant 4–8 km *perceived vistas* through LOD, terrain, atmospheric perspective. These are aspirational full-project targets, **not MVP performance or extent promises**. Avoid empty walking and clipped diorama boundaries. Every world has station -> town/road/landmark trails -> interactable content -> return station, plus subzone fast travel and quick links.

## Train station UX
1. Enter region-specific station and inspect route map.
2. Select destination; show region preview plus clear real-mode transfer labels.
3. Approach door and board; optionally seat the avatar by the window.
4. Cinematic landscape transition, target 8–20 seconds, **Skip always available**.
5. Arrive at destination station and show a skippable reveal of the environment.
6. Unlock direct fast travel after first visit.
7. Quick View, projects, contact and CV download always remain accessible without train travel.

## Avatar, camera, controls
- Third-person human explorer with natural proportions; walk, run, idle, rotate, board, sit animations.
- Desktop: WASD/arrows move; mouse/camera orbit; E interact; Esc close; optional click-to-walk.
- Mobile: tap-to-go and destination cards; no mandatory tiny joystick.
- Camera must not clip terrain or blank the entire WebGL view on W / movement.
- HTML accessibility fallback, reduced motion settings, keyboard navigation.

## Design language
- No floating islands, unbounded voids, generic neon overlays, low-poly toy villages.
- High fidelity foreground, believable midground, background mountain/city silhouettes.
- Geographic palette varies by region: Tokyo neon/rain; Kyoto warm cedar/riverside; Yamagata blue snow/gaslight; Hokkaido broad pastoral greens/purples; Koyasan cedar mist; Miyajima ocean tones.
- Small, clearly labeled non-diegetic portfolio controls: Quick View, Map, CV, Settings. Detailed case studies live in readable HTML panels.
- Respect culturally significant shrines and temples: project UI attaches to station kiosks, galleries or neutral spaces, not sacred altars.

## Engineering & rendering
Suggested stack: Next.js/React + React Three Fiber/Three.js + Blender GLB; PBR/normal maps, baked lights, LOD/frustum culling, instancing, Draco/Meshopt + KTX2, region lazy loading and adaptive resolution. Avoid promising Unreal-class ray tracing in every browser.
Goal for prototype: stable camera and 3D input, resilient WebGL failure, fast HTML Quick View, meaningful scenic composition. Measure actual FPS/device and payload; do not call untested FPS "achieved."

## P0 vertical slice — Arashiyama first
Create **one polished, navigable Kyoto/Arashiyama vertical slice** rather than seven incomplete worlds:
- Human explorer with stable third-person controls.
- Region-specific arrival station, walkable streets, Katsura river, Togetsukyo bridge, bamboo pathway, foothills and background silhouettes.
- At least two interactable portfolio kiosks/project markers, HTML detail panels.
- Train destination selection plus enter/train/window/arrival (prototype may use simplified scenic transition).
- Quick View and contact access from first screen.
- Nonblank WASD movement, collision/camera stability, performance tiering.

## Ownership / review protocol
**Agent Z (PM):** present this spec to Agent XO; produce implementation sequence, acceptance review, risks and visual benchmark storyboard; coordinate Agent T1 QA; post presentation and decisions in GitHub issues.  
**Agent XO (Dev):** publish an initial runnable MVP/vertical slice to the repository with Vercel-oriented build scripts, reference screenshots/recordings and documented run instructions.  
**UI/UX Director:** review environmental recognizability, camera, UI hierarchy and visual quality before any additional world.  
**Agent T1 (QA):** test movement keys (especially W), 3D canvas recovery, travel/return states, asset failures, mobile and keyboard fallback.

## Definition of Done for first review
- [ ] Kyoto reads as Arashiyama rather than random Japan or floating diorama.
- [ ] Human character explores streets, riverfront, bridge and bamboo route; world has depth and contiguous terrain.
- [ ] A legible rail station and destination selection exist.
- [ ] Enter, movement W/A/S/D, interact, Esc and return do not produce a blank screen.
- [ ] Project and CV content accessible in HTML without navigating the full world.
- [ ] Performance and device browser coverage documented; no unverified performance claims.
- [ ] Agent Z presents demo to stakeholder and records issues, next milestones, go/no-go.
