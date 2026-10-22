const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("scanner enforces event scope and rejects duplicate entry", () => {
  const { store } = fixture();
  const ticket = store.getState().tickets[0];
  assert.throws(
    () =>
      store.getState().scanTicket(ticket.code, store.getState().events[1].id),
    /berbeda/,
  );
  assert.equal(store.getState().tickets[0].usedAt, null);
  assert.equal(
    store.getState().scanTicket(ticket.code, ticket.eventId),
    ticket.holder,
  );
  assert.throws(
    () => store.getState().scanTicket(ticket.code, ticket.eventId),
    /sudah pernah digunakan/,
  );
});
