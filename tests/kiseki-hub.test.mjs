import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseMessage, safeExcerpt, latestReports, eventMarker,
  isAuthorizedPmDispatch
} from '../scripts/kiseki-hub-core.mjs';

test('Agent reports route to PM only', () => {
  assert.deepEqual(parseMessage('[X1] STATUS: ready'), {
    kind: 'report', role: 'X1', body: 'STATUS: ready'
  });
  assert.equal(parseMessage('regular untrusted message'), null);
  assert.equal(parseMessage('[AUTO:Z] Summary'), null);
});

test('PM dispatch targets roles exactly', () => {
  const cmd = parseMessage('[Z] DISPATCH to=XO,T1 Verify W regression');
  assert.equal(cmd.kind, 'dispatch');
  assert.deepEqual(cmd.targets, ['XO', 'T1']);
  assert.equal(cmd.task, 'Verify W regression');
  assert.deepEqual(parseMessage('[Z] DISPATCH to=ALL test').targets, ['X1', 'XO', 'T1']);
  assert.equal(parseMessage('[Z] DISPATCH to=ROOT test').kind, 'pm-update');
});

test('Untrusted actors cannot dispatch privileged PM task', () => {
  const c = parseMessage('[Z] DISPATCH to=XO test');
  assert.equal(isAuthorizedPmDispatch(c, 'someone-else', 'DevinEldrian'), false);
  assert.equal(isAuthorizedPmDispatch(c, 'DevinEldrian', 'DevinEldrian'), true);
  assert.equal(isAuthorizedPmDispatch(parseMessage('[Z] DISPATCH to=XO'), 'DevinEldrian', 'DevinEldrian'), false);
});

test('Latest human agent report wins, auto comments ignored', () => {
  const results = latestReports([
    {id: 1, body: '[T1] FAIL W crash', html_url: 'test/1'},
    {id: 2, body: '[AUTO:Z] inbox', html_url: 'test/2'},
    {id: 3, body: '[T1] BLOCKED waiting preview', html_url: 'test/3'}
  ]);
  assert.equal(results.T1.id, 3);
  assert.equal(results.Z, undefined);
});

test('Inbox sanitization and dedupe marker', () => {
  assert.equal(safeExcerpt('@boss <danger>\n xyz', 20), 'boss danger xyz');
  assert.equal(eventMarker('comment:123'), '<!-- kiseki-hub:comment:123 -->');
  assert.equal(eventMarker('comment:123'), eventMarker('comment:123'));
});
