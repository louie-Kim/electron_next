const test = require('node:test');
const assert = require('node:assert/strict');

const {
  HISTORY_LIMIT,
  appendHistoryEntry,
  getHistorySnapshot
} = require('../main/ipcHistory');

test('appendHistoryEntry stores payload, echo, and timestamp', () => {
  const history = [];
  const entry = {
    payload: 'ping',
    echo: 'ping',
    handledAt: '10:00:00 AM'
  };

  const result = appendHistoryEntry(history, entry);

  assert.equal(result.length, 1);
  assert.deepEqual(result[0], entry);
  assert.strictEqual(result, history, 'Append mutates the original array');
});

test('appendHistoryEntry trims history to the configured limit', () => {
  const history = [];
  const totalEntries = HISTORY_LIMIT + 2;

  for (let index = 0; index < totalEntries; index += 1) {
    appendHistoryEntry(history, {
      payload: `payload-${index}`,
      echo: `echo-${index}`,
      handledAt: `time-${index}`
    });
  }

  const expectedNewestIndex = totalEntries - 1;
  const expectedOldestIndex = totalEntries - HISTORY_LIMIT;

  assert.equal(history.length, HISTORY_LIMIT);
  assert.equal(history[0].payload, `payload-${expectedNewestIndex}`);
  assert.equal(history[history.length - 1].payload, `payload-${expectedOldestIndex}`);
});

test('getHistorySnapshot returns a defensive copy of the records', () => {
  const history = [];
  appendHistoryEntry(history, { payload: 'hello', echo: 'hello', handledAt: 'now' });

  const snapshot = getHistorySnapshot(history);
  assert.deepEqual(snapshot, history);
  assert.notStrictEqual(snapshot, history);

  snapshot[0].payload = 'mutated';
  assert.equal(history[0].payload, 'hello');
});
