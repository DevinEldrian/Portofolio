/**
 * KISEKI train journey finite-state model.
 * Renderers/adapters are responsible for avatar animation and scene loading.
 * The model never claims that all destinations have a direct railway connection.
 */
export const PHASES = Object.freeze({
  EXPLORE: 'world:explore',
  APPROACH: 'station:approach',
  ROUTE_SELECT: 'station:route-select',
  BOARDING: 'travel:boarding',
  WINDOW: 'travel:window',
  REVEAL: 'arrival:reveal',
  EXITING: 'arrival:exiting'
})

export const TRANSFER_MODES = Object.freeze({
  shinjuku: ['rail'],
  arashiyama: ['rail', 'tram'],
  kawaguchiko: ['rail'],
  ginzan: ['rail', 'road'],
  biei: ['rail'],
  furano: ['rail'],
  koyasan: ['rail', 'cable-car'],
  miyajima: ['rail', 'ferry']
})

export function initialJourney() {
  return { phase: PHASES.EXPLORE, destination: null, skipped: false, error: null }
}
function normalized(state) {
  if(!state || !Object.values(PHASES).includes(state.phase)) return initialJourney()
  return state
}
/** Pure transition function; invalid/out-of-order events are ignored. */
export function nextJourneyState(rawState, event) {
  const s = normalized(rawState)
  if (!event || typeof event.type !== 'string') return s
  if (event.type === 'RESET' || event.type === 'RECOVER') return initialJourney()
  if (event.type === 'ERROR') return { ...initialJourney(), error: String(event.message || 'Journey interrupted') }
  if (event.type === 'ESC' && [PHASES.APPROACH, PHASES.ROUTE_SELECT].includes(s.phase)) return initialJourney()
  switch(s.phase) {
    case PHASES.EXPLORE:
      return event.type === 'APPROACH_STATION' ? { ...s, phase: PHASES.APPROACH } : s
    case PHASES.APPROACH:
      return event.type === 'OPEN_ROUTE_MAP' ? { ...s, phase: PHASES.ROUTE_SELECT } : s
    case PHASES.ROUTE_SELECT:
      if (event.type === 'CHOOSE_DESTINATION' && typeof event.destination === 'string' && event.destination.trim() !== '') {
        return { ...s, destination: event.destination }
      }
      return event.type === 'BOARD' && s.destination ? { ...s, phase: PHASES.BOARDING } : s
    case PHASES.BOARDING:
      if(event.type === 'SKIP') return { ...s, phase: PHASES.REVEAL, skipped:true }
      return event.type === 'AVATAR_ENTERED' ? { ...s, phase:PHASES.WINDOW } : s
    case PHASES.WINDOW:
      if(event.type === 'SKIP') return { ...s, phase: PHASES.REVEAL, skipped:true }
      return event.type === 'ARRIVED' ? { ...s, phase:PHASES.REVEAL } : s
    case PHASES.REVEAL:
      if(event.type === 'SKIP' || event.type === 'DISEMBARK') return { ...s, phase: PHASES.EXITING }
      return s
    case PHASES.EXITING:
      return event.type === 'AVATAR_EXITED' ? initialJourney() : s
    default: return s
  }
}
export function isTravelling(state) {
  return [PHASES.BOARDING, PHASES.WINDOW, PHASES.REVEAL, PHASES.EXITING].includes(state?.phase)
}
export function transferLabel(destination) {
  return (TRANSFER_MODES[destination] ?? ['rail', 'transfer subject to local transit']).join(' + ')
}
