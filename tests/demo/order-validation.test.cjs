const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("invalid and expired orders never issue tickets; suspended users cannot order", () => {
  const { store } = fixture();
  const event = store.getState().events[0];
  assert.throws(
    () =>
      store.getState().createOrder({
        eventId: event.id,
        tier: event.ticketTiers[0].name,
        qty: 5,
        name: "Test",
        email: "test@example.com",
        method: "QRIS",
      }),
    /1 sampai 4/,
  );
  const pending = store
    .getState()
    .orders.find((order) => order.status === "pending");
  store.setState({
    orders: store
      .getState()
      .orders.map((order) =>
        order.id === pending.id
          ? { ...order, expiresAt: "2000-01-01T00:00:00Z" }
          : order,
      ),
  });
  const count = store.getState().tickets.length;
  assert.throws(() => store.getState().payOrder(pending.id), /kedaluwarsa/);
  assert.equal(store.getState().tickets.length, count);
  store.getState().setUserStatus("demo-user", "Review akun demo");
  assert.throws(
    () =>
      store.getState().createOrder({
        eventId: event.id,
        tier: event.ticketTiers[0].name,
        qty: 1,
        name: "Test",
        email: "test@example.com",
        method: "QRIS",
      }),
    /disuspend/,
  );
});
