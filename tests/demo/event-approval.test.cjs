const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("event review validates rejection reasons and publishes approved submissions", () => {
  const { store } = fixture();
  const event = store
    .getState()
    .events.find((item) => item.status === "pending");
  assert.throws(
    () => store.getState().decideEvent(event.id, false, "no"),
    /minimal 10/,
  );
  store.getState().decideEvent(event.id, true, "");
  assert.equal(
    store.getState().events.find((item) => item.id === event.id).status,
    "published",
  );
});
