# [X1] KISEKI Living Japan — Design Revision v2.2
**Status:** DESIGN HANDOFF FOR AGENT Z REVIEW; NOT production approval  
**Role:** Agent X1, UI/UX / Art Director | **Implementation:** Agent XO | **QA:** T1 | **Final decision:** Bos  
**Coordination:** https://github.com/DevinEldrian/Portofolio/issues/1  
**Code tracker:** https://github.com/DevinEldrian/Portofolio/issues/2  
**Supersedes:** generic empty city, low-poly toy/abstract NPCs, instant train wipe, empty CV interaction points. Augments [v2.1](JAPAN_RAIL_DESIGN_HANDOFF.md) and [geographic blockout v0.1](ARASHIYAMA_X1_WORLD_BLOCKOUT.md).

> **Design thesis:** a Japanese town is not just landmark geometry. It is an interlocking **place identity + human routine + weather/ambience + exploration narrative + believable rail arrival**. Each of those must be visible within 30–60 seconds of arriving.

## A. Research and provenance (official tourism sources)
- [JNTO Arashiyama](https://www.japan.travel/en/spot/1142/) — Bamboo grove, Togetsukyo, mountain scenery and Tenryu-ji context. North-west Kyoto, multiple distinct rail approaches.
- [JNTO Togetsukyo Bridge](https://www.japan.travel/en/spot/72/) — 155 m landmark, Katsura River, surrounding hills; columns/beams reinforced concrete with cypress parapets. Avoid depicting entire bridge as primitive wood planks.
- [JNTO Bamboo Grove](https://www.japan.travel/en/spot/1141/) — Enclosed, emerald-green bamboo path and Nonomiya context.
- [Randen Arashiyama Station official](https://www.kyotoarashiyama.jp/about/en) — Kimono Forest area, active station shops and café/food facilities, footbath, bamboos, Kyoto craft motifs.
- [GO TOKYO Akihabara Electric Town](https://www.gotokyo.org/en/spot/55/index.html) and [Akihabara official walking tour](https://www.gotokyo.org/en/story/walks-and-tours/akihabara/index.html) — Electric Town Exit, Chuo-dori, specialist electronics and anime/figure stores, Radio Kaikan, subculture side streets. Sunday pedestrianization is day/time/weather-dependent; do not hard-code 24/7 pedestrian-only city.
- [GO TOKYO Shibuya Crossing](https://www.gotokyo.org/en/spot/78/index.html), [Shibuya Center-Gai](https://www.gotokyo.org/en/spot/88/index.html), [Shibuya walking tour](https://www.gotokyo.org/en/story/walks-and-tours/shibuya/index.html) — Hachiko-side Shibuya Station → scramble crosswalk → Center-Gai, fashion/music nightlife, characteristic flow of crowds.
- [GO TOKYO QFRONT](https://www.gotokyo.org/en/spot/366/index.html) — large display facing scramble crossing; recognizable large-screen massing.

**Reference use:** Do not copy brands, advertisements, original manga/anime character art or Kimono Forest textile patterns without permission. Create fictional but culturally plausible store names and original graphics. Japanese text should be checked by a competent speaker before shipping. Explicitly label geographic compression and cinematic fictional rail links.

## B. Kyoto Arashiyama — P0 playable spatial sequence
**Chosen design recommendation:** Randen Arashiyama station is the *primary player spawn*. JR Saga-Arashiyama is a separate station, not part of the Randen platform. All spatial distances are compressed for game pacing; the order and physical story are *inspired by* the real walk, not a surveyed street plan.

### North-up relationship diagram — not to scale
```
                   NORTH / SAGANO
     Bamboo Grove ─── woodland path ─── Nonomiya vicinity
          │
   Tenryu-ji external wall / approach ─ JR Saga-Arashiyama (secondary)
          │
   [P4 Reflection in bamboo path, neutral outside shrine grounds]
          │
   [Randen Arashiyama Station + Kimono-Forest-inspired columns]
          │     [P1 Welcome / E-Claim]
   Active Nagatsuji-dori-inspired shops and snack street
          │        └─ craft stalls / rickshaw waiting zone
          │
  Katsura northern-bank pedestrian promenade [P2 Treasury QA]
          │                         ↘ view toward foothills
   Togetsukyo Bridge / wide river / east-west backdrop
          │       [P3 Project case study at public riverside lookout]
       South-bank park and road as bounded scenic context
                   SOUTH
```
**World-building rule:** Build a connected street corridor and believable intersections, side alleys, terrain/vegetation continuation and distant hills. No cliff-edge diorama or empty central square. Preserve respectful space around temple grounds.

### Five framing shots required (X1 design review)
1. **Arrival: 24mm equivalent lens**, frame purple Randen tram, modest station building/entrance, illuminated original-pattern textile columns, foot traffic, shops.
2. **Market walk: 28–35mm**, human-scale store thresholds, noren awnings, original Japanese shop signs, shopkeeper tending display, crossing pedestrians, subtle urban sound.
3. **Riverside reveal: wide lens**, continuous Katsura water plane with bank, boats/river textures as budget allows; 155m-feel Togetsukyo structural silhouette and wooded slopes beyond.
4. **Bridge: eye-level perspective**, proportionate railing, surface material, passing walkers / photography pauses, river visible through railings.
5. **Bamboo: 35mm**, clustered bamboo at varied heights, narrow curved path with deep occlusion, breeze-driven leaf movement, dappled sunlight and distinct airy wind audio.

### P0 functional locations and purpose
| ID | Neutral placement | Physical story | Interactable CV (see D) | NPC beats |
|----|-------------------|----------------|------------------------|----------|
| ST | Randen arrival plaza | Purple one/two-car tram, ticket displays, route board, craft columns | World Guide + Rail Travel | 1 station attendant + transit riders |
| A  | Main street shopfront bay, not inside sacred site | Souvenir/snack shop, serving counter, price cards, vending/vitrine | **P1 E-Claim · Learning to Build** | Shopkeeper opens stall, buyer browses, passerby window-shops |
| B  | North riverbank observation bench | Wide river, bridges, rickshaw turning, cyclists | **P2 Treasury QA · Reliability Matters** | Photographer pauses, couple chats, locals walk |
| C  | Public bridge-side terrace / map board | Bridge landmark and distant mountains | **P3 Projects / case studies** only when actual project data approved | People pause then continue |
| D  | Quiet bamboo *public* path before sacred precinct | Deep canopy, leaf litter and wind | **P4 My Approach · Curiosity & Quality** | Slow walkers, nature photographers; low densities |
| EX | Randen ticket gate / destination board | Journey entry/exit and return | Route/Quick View/Resume | Riders align near doors, departure cues |

*XO already has draft IDs* `street-eclaim`, `riverside-treasury`, `forest-values` in `src/portfolioContent.js` on `feat/xo-arashiyama-p0`. **Reuse these exact IDs and anchor strings** (`main-street-neutral-kiosk`, `riverbank-neutral-kiosk`, `bamboo-neutral-path`) to avoid breaking data references. Proposed P3 is an **additional optional** marker, never fabricated CV data.

## C. "Living city" rules — NPC, activity, signage, ambience and weather

### Human NPC (P0 target is visible activity, not raw population count)
**Silhouettes:** human-shaped, varied height/body type/clothing appropriate to local climate and crowd; 3–5 interchangeable outfits/skin tones and practical props; no mannequin spheres/cylinders. Avoid stereotypes/exaggerated caricatures. No interaction that blocks the professional task.

**Behavior state library** (explicit motions and transitions):
- `walk_to` → `slow_at_crosswalk_or_shop` → `browse/display` → `react_idle` → `resume_route`; use plausible eye/head turns, foot placement, no random teleport within sight.
- Shopkeeper: lift shutter (at scene start or idle cycle) → arrange goods → greet purchaser with short subtitle/audio optional → return to counter.
- Tourist: walk → stop → photograph landscape → lower phone → walk onward.
- Station: wait near platform line → look at signage → queue → board door after safe opening; no walking through cars.
- Rickshaw/transport (optional): pass route loop, yield to avatar and pedestrians; no physically impossible motion.

**Budget proposal** (subject to XO measured performance): in first viewport show 4–8 *believably animated* NPCs; further background pedestrians can use simple impostors or reduced animation. Do not force fixed counts if FPS suffers; visible meaningful variation matters more than density.

**Game logic:** bounded navigation graph/navmesh, waypoint paths, priority spaces near kiosk interaction radius, obstacle avoidance or steering, simple LOD update rates, pooled mesh instancing for background, distinct animation clips `idle`, `walk`, `browse`, `wave`, `photo`, `board`. Avatar never collides or sticks permanently against crowds; accessibility setting reduces crowd activity.

### Shops & signboards
- A storefront must show at least **2 clear states**: open counter/door/visible goods + idle activity (stocking/buying/queue). No fake permanent billboard-only shop.
- Arashiyama categories: Kyoto sweets, tea, snack shop, artisan craft/cloth, souvenir, kimono rental, rickshaw stand, rail station shop. Prioritize original local-language signage, simple menu graphics and warm window lighting.
- Transit wayfinding: exit, platform, ticket desk, river/Togetsukyo, bamboo grove, map post. Use plausible railway symbols and multilingual location labels sparingly.
- No copyrighted anime posters in Kyoto; in Tokyo/Akihabara use **new original** illustrated properties or cleared licensed visuals.

### Ambience / Weather matrix
| World | Lighting + weather anchor | Ambient sound | Moving world |
|-------|---------------------------|---------------|--------------|
| **Kyoto P0** | warm autumn **golden-hour**, gentle breeze, slightly hazy mountains; a **second testable overcast/light-drizzle mode** (manual toggle is acceptable) | Randen bell/wheels, footsteps, shop voices, river water, birds, bamboo creak | moving leaves, water, noren cloth, distant tram arrival |
| **Akihabara P1** | vivid daytime shop displays or post-rain evening, controlled wet reflections | JR/train hum, arcade sounds from doorways, chatter, electronics hum | opening shop shutters, rotating displays, customers exchanging goods |
| **Shibuya P1** | blue-hour/evening, dynamic storefront lighting, optional light rain | crossing signal tones, traffic, crowd waves, short storefront/club bleed | crowd batches synchronized to traffic light, moving buses/taxis, giant screen loops |

**Weather quality tiers:** desktop High = material wetness/ripple/reflection approximations, mild fog, particle wind; Mid = simpler materials/fewer agents; Low/mobile = baked color changes and wind normals, NO heavy particles. The world remains recognizable if post-processing is off. No flashing, heavy rain or sound auto-play without user control. Reduced motion disables camera bob and leaf particles while keeping essential states visible.

## D. CV storytelling — strong narrative, verified evidence, not empty markers
**Information architecture:** each of the 3 existing XO hotspot records uses the same `label`, `teaser`, `story`, `evidence`, `note` and anchor IDs already present in `src/portfolioContent.js`. Treat all role/dates/claims as **draft requiring Bos confirmation** before publication. Do NOT expose confidential employer architecture, transactions, banking clients, screenshots or test artifacts.

Every hotspot must be readable in 3 layers:
1. **World clue** (5–10 words, e.g. "Behind each interface is a user's trust"); icon in world with 2–4 m recognition, halo subtle and no giant game quest exclamation.
2. **Story panel** (headline + dates/role if verified + 40–90 word personal story: *context → action → impact/learning*); use semantic HTML and accessible contrast.
3. **Proof / call-to-action** (3 short evidence bullets from approved CV; optional linked work/case study only if publicly shareable; `Next chapter` or `View all CV`).

**Education factual correction (Agent Z / Bos CV directive):** The existing XO dataset's phrase *“AI for Business major”* is incorrect and must not ship. Approved-for-design factual baseline from Agent Z: **Master of Information Technology, focus on AI (Feb 2026–present)**; **Bachelor of Information Technology, Business Information Technology major (Sep 2021–Dec 2025)**. XO must reconcile all remaining dates, employers, skills and any public wording with Bos before release. Provide About/Education directly in Quick View and use it as context in the first kiosk.

**Concrete beats, matching XO source:**
- `street-eclaim`, shop/street kiosk near arrival: **"Learning to Build"** — E-Claim internship, UI/frontend improvement, functional retests; metaphor: thoughtful design at shop threshold. **Not** a bank system recreation.
- `riverside-treasury`, riverside public marker: **"Reliability Matters"** — Treasury QA, end-to-end validation, defects/regression; river/bridge continuity metaphor. Describe *responsibility and method*, not internal SWIFT messages or proprietary Murex flows.
- `forest-values`, public forest path: **"Curiosity & Quality"** — connection between UX empathy and testing rigor; contemplation and aspiration. No fabricated awards or claims.
- optional `bridge-projects`, public viewpoint: featured project case studies only after Bos supplies accurate title, role, challenge, stack, screenshots, public links and result. Placeholder should clearly say **"Project details to be confirmed"**, not fake KPI.

**Hotspot discovery & UX:** distance cue + clear prompt `E: Read this chapter`; hover/tap opens same accessible panel; keyboard focus moved to panel header and returned on close; `Esc` or X closes; HTML Quick View offers all same chapters by title from any moment, even during travel or WebGL failure. Keep interface within 1 click for recruiters. Add a compact "Journey journal" showing Chapters 1/3 visited *without gating Contact/CV*.

## E. Station-to-train-to-arrival full embodied storyboard
**Transit honesty:** P0 boarding vehicle is a **Randen-style Kyoto tram**. Demo can begin at a simplified city-side Randen platform and end at Randen Arashiyama. **Do not depict Tokyo–Kyoto as a direct Randen tram line.** For longer future routes, station itinerary UI must describe rail transfers and bus/cable car/ferry where real-world required. Use stylized cinematic vignettes labeled as artistic transitions.

| Beat | State mapping to XO `trainJourney.js` | Camera & animation | Audio/UI | Recovery |
|------|---------------------------------------|--------------------|----------|----------|
| 01. Station approach (3–6s free movement) | `EXPLORE → APPROACH` | 3rd person walks to gate/sign; tram seen waiting | Location sign, `E: Route Board` | Esc backs out |
| 02. Choose itinerary (user controlled) | `APPROACH → ROUTE_SELECT` | Stable shoulder camera; avatar still visible beside route board | Destination preview, estimated cinematic length, skip/reduced-motion control, correct transfer labels | Esc closes; tab/keyboard operable |
| 03. Walk to train / door (3–5s) | `ROUTE_SELECT → BOARDING` | Avatar follows marked safe path; doors open; turn-to-door then step into cabin (no pop-teleport) | Footstep/door chime, `Skip journey` visible | If missing animation, fade-to-station-safe but preserve arrival |
| 04. Inside / seated (2–3s) | `BOARDING → WINDOW` on `AVATAR_ENTERED` | Show interior handholds/seats, avatar sits beside window or stands holding rail; subtle engine sway | Low station noise fades to motor rail; `Skip` / `Quick View` | Reduced-motion static interior frame |
| 05. Travel vista (6–12s) | `WINDOW → REVEAL` on `ARRIVED` | Window countryside parallax, bridges/trees/town transitioning as per route; do not hard-cut from inside train to another world | Wind, wheel rhythm, 1-line chapter teaser, optional progress | `SKIP` proceeds safely |
| 06. New station arrival (2–3s) | `REVEAL → EXITING` on `DISEMBARK` or `SKIP` | Tram slows/stops, doors open; camera from cabin to platform | Arrival label: Arashiyama; gentle scene color shift | Recover if scene fails |
| 07. Walk off platform (2–4s) | `EXITING → EXPLORE` on `AVATAR_EXITED` | Avatar visibly stands, walks through doors and onto platform; 3rd-person camera takes over without clip | World exploration prompts restore; map available | `RESET/RECOVER` safe spawn |

**Temporal budget:** 12–25s total cinematic on first trip (excluding user-driven route choice), with **Skip from boarding onward** and immediate Quick View. XO's existing events and phase names are authoritative; animations subscribe to phase changes and dispatch `AVATAR_ENTERED`, `ARRIVED`, `DISEMBARK`, `AVATAR_EXITED` when completed. Do not race state transitions.

**Critical regression cases for T1:** double-click boarding, press Esc during route select, skip while boarding, skip while scene streaming, reload during window stage, missing tram asset, accessibility reduced motion, holding W when transition begins, WebGL context loss, avatar camera out of bounds. Never leave black screen and never mark `AVATAR_EXITED` before avatar/scene is ready.

## F. Tokyo P1 concept separation — Akihabara is NOT Shibuya
These are **P1 pre-production concept briefs**, not approval to build ahead of Arashiyama. Each has unique urban geometry, storefront typology, crowd simulation and interaction chapter structure.

### Akihabara — Electric Town / electronics-and-otaku culture
- **Arrival**: JR Akihabara **Electric Town Exit**, not Shibuya Station. Frame concourse/viaduct, dense shops.
- **Key spine**: station exit → Radio Kaikan-like dense multi-floor hobby retail → Chuo-dori electronics/figures/computer street → small side-lane specialty stores / gachapon.
- **Authentic architecture & texture**: stacked slim commercial facades, signage in vertical bands, windows packed with boxes/model kits, arcades, PC/electronics parts counters, multi-story merchandise displays, pachinko/arcade only as contextual fiction.
- **Human NPC behaviors**: anime merchandise browsing, cosplayer photo-seeking *with consent*, friends comparing game boxes, hardware shopper inspecting parts, clerk arranging figures, train passengers. Avoid abstract faceless sticks.
- **Motion & audio**: arcade machine UI pings, escalators, vending/gachapon motion, electronic chimes, JR ambience; signage static/dynamic judiciously, rain is optional variant.
- **Portfolio opportunities**: interactive "tech workshop" for skills/tools, project gallery in imaginary multi-floor showroom; no unlicensed existing anime/movie game posters. Make original fictional character art with artist permissions.
- **What must be visible in one scene**: Electric Town Exit wayfinding, Chuo-dori store mix, packed specialist showcases, genuine sidewalk flow. **No scramble crossing centerpiece.**
- **Official refs**: https://www.gotokyo.org/en/spot/55/index.html ; https://www.gotokyo.org/en/story/walks-and-tours/akihabara/index.html

### Shibuya — Scramble Crossing / fashion-and-creative city
- **Arrival**: Shibuya Station Hachiko-side exit; Hachiko plaza as orienting landmark, no electric-town station signs.
- **Key spine**: Hachiko plaza → multi-directional Scramble Crossing with crossing light phases → broad display-front QFRONT-like massing → Center-Gai fashion/music shops, branching to Dogenzaka.
- **Authentic architecture & texture**: very wide intersection geometry, painted crosswalk stripes in multiple directions, towering screens and department store façades, glass + billboard vertical density, narrower Center-Gai retail lane. Distinguish commercial areas and pedestrian hierarchy.
- **Crowd choreography**: **wait at red** on curb, **surge in synchronized waves at pedestrian green**, fan out after crossing, avoid avatar, occasionally stop for phone/photo. Vehicle traffic moves in complementary phase (not through pedestrians). Reduce actual spawned agents by crowd LOD, impostors/background loops; **behavior fidelity > raw NPC count**.
- **Motion & audio**: crosswalk signal tones, traffic stop-and-go, station announcements, crowd chatter, urban music leaking from shops; blue-hour neon palette or rainy evening variant.
- **Portfolio opportunities**: creative collaboration "campaign" or contact/communication chapter, project media wall in neutral office/gallery. No project overlay on Hachiko memorial.
- **What must be visible in one scene**: multi-direction crossing, coherent traffic signals, crowd waves, QFRONT-like screen facing intersection, Center-Gai entry. **Not Akihabara figure/electronics shop grid.**
- **Official refs**: https://www.gotokyo.org/en/spot/78/index.html ; https://www.gotokyo.org/en/spot/88/index.html ; https://www.gotokyo.org/en/spot/86/ ; https://www.gotokyo.org/en/spot/366/index.html

## G. Implementation handoff & priorities

### Milestone order proposed to Agent Z
- **P0-Design gate:** approve Randen primary spawn, single coherent autumn golden-hour mood, X1 map and landmark placement, NPC/shops/hotspots, and train storyboard.
- **P0-Dev gate 1:** XO implements *recognizable* station / street / Katsura / Togetsukyo / bamboo in one continuous area, with human avatar and movement safety. 5 camera shots + map proof required.
- **P0-Dev gate 2:** XO wires `portfolioContent.js` hotspot IDs to visible panels and 3D triggers; one-to-one data; human NPC shop activity, soft autumn breeze/weather.
- **P0-Dev gate 3:** XO wires `trainJourney.js` phase/events to camera, avatar, train doors/interior/window, arrival/exit animations and skip/recover.
- **P0-QA/visual gate:** T1 browser regressions with evidence; X1 visual & narrative design review; Agent Z presents GO/NO-GO to Bos.
- **P1 preproduction:** Akihabara/Shibuya reference boards and blockout only after Z authorizes scope; no full production until P0 quality acceptance.

### Visual acceptance tests (X1)
1. 5 Arashiyama shots immediately distinguish place without any location label.
2. At least station, street and riverside have visible human-scale lived-in activity, with meaningful people animations. No abstract cylinder people.
3. An active storefront clearly communicates goods and commerce; Japanese signage is legible and plausible.
4. Weather/ambient motion affects visual perception without harming navigation or readability; low/reduced-motion quality mode remains recognizable.
5. Each shipped CV marker opens a real user-verifiable story and evidence (no empty modal, no invented achievements); same content in HTML Quick View.
6. Full travel visibly includes walking, boarding, interior/window, arriving, and walking off (or accessible skip); no loading-wipe-only journey.
7. Akihabara visual grammar is anime/electronics retail; Shibuya visual grammar is scramble crossing/fashion/crowd flow. No copy-paste city block art.
8. Check frame times, memory, texture licensing, responsive controls, recovery and accessibility using **actual hardware/browser evidence**.
9. **No merge to production auto-deploy branch nor production deployment without explicit Bos approval.** Design docs stored in isolated design branch.

### Explicit requests to Agent Z
- **Agent Z has approved** Randen primary arrival, **autumn golden-hour** anchor, and secondary overcast/light-drizzle mode; XO should follow those decisions without waiting for another design choice.
- **Agent Z has now approved the P0 interpretation:** **2 kiosks + 1 optional quiet neutral forest reflection marker** using XO's three existing hotspot IDs, pending factual CV corrections and Bos content approval.
- Confirm visual checkpoint **before** materials and **after** animated scene.
- Confirm measured NPC/asset budgets and actual timing of the full walking/boarding/window/exiting travel sequence (design suggestion 12–25s, always skippable); P1 only after P0/Bos approval.
- Request from Bos final approval of exact CV narrative and any public project screenshots before release.

## Current state and caveat
The XO branch already has `src/portfolioContent.js` hotspot data and `src/trainJourney.js` pure state model, per Issue #1 and source inspection. **Those data/state foundations are NOT visually implemented or QA-passed.** This document is design direction, not a claim of finished playable scenes.
