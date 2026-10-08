# X1 — Arashiyama M0 buildable art-direction lock v2.3

**Date:** 2026-10-08. **Owner:** X1. **Status:** DESIGN HANDOFF, CHANGES REQUIRED in current runtime, NOT visual QA approval.
**Inputs:** Master Directive v3 (Issue #1), Living Japan v2.2, geographic blockout v0.1, rail handoff v2.1. Code inspection: XO branch 03b8285 and draft PR #4 head 19fd5a7.

## Current source audit (NOT browser-tested)

| Priority | Finding | Required correction |
|---|---|---|
| P0 | Kyoto `src/world.js` draws repeated torii gates, generic houses and pink sakura; no river, bridge or bamboo. | Replace with connected Randen station, active Kyoto shops, Katsura river, Togetsukyo bridge and bamboo; lock autumn palette. |
| P0 | `src/locations.js` says FUSHIMI for Kyoto, and SHIBUYA / ELECTRIC for Tokyo. | Kyoto label must say ARASHIYAMA / SAGANO; Tokyo Shibuya and Akihabara are distinct P1 concepts. |
| P0 | `src/App.jsx` uses a 1100ms travel overlay despite existing train FSM. | Render actual avatar boarding, interior, moving window, arrival and exiting. |
| P0 | PR #4 kiosks are at `(-5,14)`, `(-8,-44)`, `(7,-75)` but no riverside or bamboo exists there. | Relocate after connected geometry; keep exact narrative IDs. |
| P1 | Current kiosk mesh is repeated monolith signage. Click raycast can choose a sign behind occluding scenery. | Place context-sensitive wayfinding plaques and enforce proximity/occlusion for pointer interactions. |
| P1 | Current story modal does not visibly restore keyboard focus to trigger; forest-values source says “AI for Business major”. | T1 accessibility review and XO education text correction before release. |
| P1 | No human NPC behaviors or weather controls in current source. | Add visible walk/browse/photo/wait/board behaviors, autumn wind and drizzle toggle. |

**PR #4 visual decision:** CHANGES REQUIRED, although the story-data integration is a useful foundation. No production merge.

## Proposed Kyoto graybox coordinates

**Convention:** +x east, -z north; local game units, NOT a surveyed real-world map. Existing Randen station `(20,-10)` is retained to reduce code churn. All coordinates are **proposals** subject to XO collision and camera verification.

```
 NORTH (-z)
   Bamboo grove (-44,-55) -- public reflection marker (-44,-48)
          |             Tenryu-ji outer perimeter (-28,-20)
          +---- public path ---- Randen station (20,-10) -- tram (45,-10)
                                   |
                             Shops (6,25) + E-Claim plaque (2,24)
                                   |
                             Riverbank (0,56) + QA plaque (3,55)
                                   |
       Togetsukyo-like bridge (-32,75) --- Katsura river (z≈63..90)
 SOUTH (+z)             wooded foothills, second bank
```

**Required paths:** station→shops→river, river→bridge, station→bamboo via outer temple path, all reversible with no teleports or visible world-edge drop. At least 3 game units clear around kiosks. River and bridge must be physically separate from generic torii or shrine props. A full-scale replica is not required.

## Five reproducible visual checkpoints

1. **Arrival:** purple Randen tram, station entrance, original-pattern textile columns, station staff and arriving passengers.
2. **Shop corridor:** distinct Kyoto sweets/tea/craft/souvenir storefronts, goods on display, clerk arranging merchandise, walking shopper, E-Claim plaque.
3. **River reveal:** wide Katsura water surface, bank stones, Togetsukyo silhouette, forested slopes and second story plaque.
4. **Bridge:** credible spanning structure, handrail, pedestrians and both riverbanks.
5. **Bamboo:** dense tall stems, curved public path, moving leaves, dappled light and third reflection plaque.

Every capture must record SHA, camera position/heading and viewport size. X1 rejects generic empty-village frames, pink spring sakura in autumn, repeated torii road, or cylinder NPCs. Need a continuous traversal video in addition to stills.

## Human activity: specific NPC beats

| NPC | Route | Visible action |
|---|---|---|
| Station passenger | waiting line→tram door | checks timetable, waits for open door, boards |
| Shopkeeper | shop interior→front display | arranges goods, greets, returns to counter |
| Shopper | sidewalk→display→sidewalk | walks, browses, resumes route |
| Photographer | riverbank→bridge viewpoint | raises camera, takes photo, continues |
| Grove visitor | bamboo entrance→curved path | slow walk, looks up, yields |

Use recognizable human proportions and distinct idle/walk/browse/photo/board motions. First-view desktop target 4–8 animated characters is **unverified until device profiling**. Scale density for mobile. Avoid blocking kiosk radius and station doors.

## Weather lock

P0 **late-autumn golden hour** with rust/maple leaves, evergreen bamboo, warm shop lighting, subtle noren movement, river sound and optional tram audio. Second **overcast/light-drizzle toggle** with reduced-motion, mute and mobile-low fallbacks. Missing audio/particles cannot block movement or CV Quick View. Do not autoplay sound without consent.

## Embodied Randen rail handoff

Use existing `src/trainJourney.js` phases and events, not a separate timeout:

- `APPROACH`: avatar at visible station, route-board prompt; Esc cancels.
- `ROUTE_SELECT`: accessible itinerary, honest transfer labeling; choose destination.
- `BOARDING`: doors open, avatar walks through doorway; emit `AVATAR_ENTERED` only after entering.
- `WINDOW`: visible cabin, avatar and outside parallax; `ARRIVED` after movement.
- `REVEAL`: destination platform, stopped tram and opening doors; `DISEMBARK`.
- `EXITING`: avatar steps onto valid platform; camera/control restored; `AVATAR_EXITED`.

Suggested pacing 12–25 seconds excluding choice, Skip from boarding onward. Skip, Esc, reload, missing asset and WebGL loss must recover without a black screen. A Randen tram is local Kyoto transport; never imply direct Randen service from Tokyo.

## CV plaque placement and accessibility

Preserve IDs `street-eclaim`, `riverside-treasury`, `forest-values` and original narrative fields. Use three visually different small signs suited to shopfront, public river promenade and bamboo public path. Never place interactive work stories inside sacred grounds. `E`, click/tap and one-click HTML Quick View must show substantive, fact-checked content. Escape closes; focus should return to the trigger. Correct degree wording per Master Directive and seek Bos approval for personal CV claims. No invented metrics or unpublished employer material.

## Handoff

**XO:** correct locale labels/season and connected graybox first, relocate markers, implement human activity/weather/rail, submit five screenshots plus video and exact SHA. Keep changes off main.
**T1:** static-review PR #4 now, then independently test keyboard W/E/Esc, click occlusion, mobile tap, focus, story accuracy, weather and rail Skip in an actual browser. Report PASS/FAIL/BLOCKED/NOT TESTED.
**Z:** review this M0 specification before art-polish lock, then require runtime evidence for GO/NO-GO. Production remains frozen pending Bos' explicit approval.

**X1 status: M0 DESIGN READY FOR Z REVIEW; RUNTIME VISUAL SIGN-OFF PENDING.**
