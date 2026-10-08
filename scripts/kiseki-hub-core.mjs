// Pure routing rules for the KISEKI PM hub. Never grants repository write access.
export const ROLES = Object.freeze(['X1', 'XO', 'T1']);
export const HUB_ISSUE = 1;

export function parseMessage(value) {
  const text = String(value || '').trim();
  if (/^\[(?:AUTO|RUNNER|BOT):/i.test(text)) return null;
  const match = text.match(/^\[(Z|X1|XO|T1)\]\s*([\s\S]*)$/i);
  if (!match) return null;
  const role = match[1].toUpperCase();
  const body = match[2].trim();
  if (role !== 'Z') return { kind: 'report', role, body: body.slice(0, 6000) };
  const cmd = body.match(/^DISPATCH\s+to=(ALL|(?:X1|XO|T1)(?:,(?:X1|XO|T1))*)(?:\s+|$)/i);
  if (!cmd) return { kind: 'pm-update', role, body: body.slice(0, 6000) };
  const target = cmd[1].toUpperCase();
  const task = body.slice(cmd[0].length).trim();
  return {
    kind: 'dispatch',
    role,
    targets: target === 'ALL' ? [...ROLES] : [...new Set(target.split(','))],
    task: task.slice(0, 3500)
  };
}

export function safeExcerpt(value, limit = 400) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>@]/g, '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

export function latestReports(comments) {
  const found = {};
  for (const comment of [...comments].reverse()) {
    const parsed = parseMessage(comment.body);
    if (parsed && parsed.kind === 'report' && !found[parsed.role]) {
      found[parsed.role] = {
        id: comment.id,
        url: comment.html_url || '',
        summary: safeExcerpt(parsed.body)
      };
    }
  }
  return found;
}

export function eventMarker(key) {
  const normalized = String(key).replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 120);
  return '<!-- kiseki-hub:' + normalized + ' -->';
}

export function isAuthorizedPmDispatch(message, actor, bosLogin) {
  return message?.kind === 'dispatch' &&
    actor === bosLogin && message.targets.length > 0 &&
    message.task.length > 0;
}
