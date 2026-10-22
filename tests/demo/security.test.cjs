const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("session revocation preserves the current device", () => {
  const { store } = fixture();
  store.getState().revokeSession();
  assert.equal(
    store.getState().sessions.find((item) => item.current).revoked,
    false,
  );
  assert.equal(
    store.getState().sessions.filter((item) => !item.current && !item.revoked)
      .length,
    0,
  );
});
