const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("schedule changes preserve Jakarta time and cancellation notifies attendees", () => {
  const { store, model } = fixture();
  const event = store
    .getState()
    .events.find((item) => item.status === "published");
  store.getState().updateEvent(event.id, "2026-12-24T18:30", "Venue Baru");
  const updated = store.getState().events.find((item) => item.id === event.id);
  assert.equal(model.localDateInput(updated.eventDate), "2026-12-24T18:30");
  assert.match(updated.time, /18.30/);
  store.getState().cancelEvent(event.id, "Perbaikan keamanan venue");
  assert.equal(
    store.getState().events.find((item) => item.id === event.id).status,
    "cancelled",
  );
  assert.equal(store.getState().notifications[0].category, "event");
});
