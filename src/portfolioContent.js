/**
 * Narrative hotspots for KISEKI Arashiyama P0.
 * Keep only verified resume facts here. Review final wording with Bos before release.
 * Kiosk coordinates are deliberately omitted until the X1 world blockout is signed off.
 * No confidential systems, banking customer information, project screenshots or source code.
 */
export const HOTSPOTS = Object.freeze([
  {
    id: 'street-eclaim',
    region: 'arashiyama',
    anchor: 'main-street-neutral-kiosk',
    label: 'E-Claim · Learning to Build',
    kind: 'experience',
    subtitle: 'Sinarmas Insurance · IT Intern · Feb 2024 – Jan 2025',
    teaser: 'Behind every working interface is a chain of thoughtful decisions and careful testing.',
    story: 'I helped improve the E-Claim web application through UI changes, frontend page work, functional checks and retesting. This shaped how I think about software: the smallest interface interaction should earn a user’s trust.',
    evidence: [
      'Created UI improvements and frontend pages according to requirements.',
      'Tested E-Claim features and documented functional test progress.',
      'Rechecked features after fixes and shared findings with the team.'
    ],
    note: 'Portfolio summary, not a reproduction of employer systems.',
  },
  {
    id: 'riverside-treasury',
    region: 'arashiyama',
    anchor: 'riverbank-neutral-kiosk',
    label: 'Treasury QA · Reliability Matters',
    kind: 'experience',
    subtitle: 'Bank Negara Indonesia · IT Quality Assurance · Jun 2026 – Present',
    teaser: 'A system is only as strong as its ability to behave correctly when it matters.',
    story: 'My Treasury QA work involves checking functionality and end-to-end workflows around financial messaging and trading platforms. I design test scenarios, investigate discrepancies and validate fixes so business teams can operate with confidence.',
    evidence: [
      'Created and executed functional, integration and regression test scenarios.',
      'Supported user acceptance testing and end-to-end transaction validation.',
      'Documented defects, coordinated fixes and performed regression retesting.'
    ],
    note: 'Only public, high-level skills are described; no internal or customer data.',
  },
  {
    id: 'forest-values',
    region: 'arashiyama',
    anchor: 'bamboo-neutral-path',
    label: 'My Approach · Curiosity & Quality',
    kind: 'about',
    subtitle: 'Devin Eldrian Wijaya · Jakarta, Indonesia',
    teaser: 'A strong product combines curiosity, empathy and reliable execution.',
    story: 'My path connects UI work with systematic quality assurance. I enjoy understanding how an experience feels to users and how its underlying behavior stands up to real-world expectations.',
    evidence: [
      'Education: Master of Information Technology (AI focus, Feb 2026–present); Bachelor of Information Technology (Business Information Technology major, Sep 2021–Dec 2025).',
      'Professional focus: software testing, QA, UI improvements and collaboration.',
      'Working skills include test case design, SQL and Python.'
    ],
    note: 'Personal summary derived from CV; review with Bos for final voice.',
  }
])

export function getHotspot(id) { return HOTSPOTS.find(point => point.id === id) ?? null }
export const P0_KIOSKS = HOTSPOTS.filter(point => point.anchor.includes('kiosk'))
