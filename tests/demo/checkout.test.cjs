const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("checkout reserves capacity, cancellation releases it and payment cannot issue duplicate tickets", () => {
  const { store, model, storage } = fixture();
  const event = store.getState().events[0];
  const tier = event.ticketTiers[0].name;
  const before = model.remainingSeats(event, store.getState().orders, tier);
  const orderId = store.getState().createOrder({
    eventId: event.id,
    tier,
    qty: 2,
    name: "Test User",
    email: "test@example.com",
    method: "QRIS",
  });
  assert.equal(
    model.remainingSeats(event, store.getState().orders, tier),
    before - 2,
  );
  const ticketsBefore = store.getState().tickets.length;
  store.getState().payOrder(orderId);
  assert.equal(store.getState().tickets.length, ticketsBefore + 2);
  assert.throws(
    () => store.getState().payOrder(orderId),
    /tidak dapat dibayar/,
  );
  assert.equal(store.getState().tickets.length, ticketsBefore + 2);
  const otherId = store.getState().createOrder({
    eventId: event.id,
    tier,
    qty: 1,
    name: "Test User",
    email: "test@example.com",
    method: "QRIS",
  });
  store.getState().cancelOrder(otherId);
  assert.equal(
    model.remainingSeats(event, store.getState().orders, tier),
    before - 2,
  );
  assert.ok(storage.get("concertgo-interactive-demo-v1"));
});
