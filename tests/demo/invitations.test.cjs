const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("invitation role hierarchy, duplicate protection, token rotation and one-time activation", () => {
  const { store } = fixture();
  assert.throws(
    () => store.getState().invite("new@example.com", "ADMIN", "ADMIN"),
    /tidak diizinkan/,
  );
  assert.throws(
    () =>
      store.getState().invite("raka@example.com", "ORGANIZER", "SUPER_ADMIN"),
    /sudah terdaftar/,
  );
  const firstToken = store
    .getState()
    .invite(" NEW@example.com ", "ORGANIZER", "SUPER_ADMIN");
  assert.throws(
    () =>
      store.getState().invite("new@example.com", "ORGANIZER", "SUPER_ADMIN"),
    /undangan aktif/,
  );
  const invitation = store
    .getState()
    .invites.find((item) => item.token === firstToken);
  store.getState().resendInvite(invitation.id);
  const rotated = store
    .getState()
    .invites.find((item) => item.id === invitation.id);
  assert.notEqual(rotated.token, firstToken);
  assert.throws(
    () => store.getState().acceptInvite(firstToken, "New Organizer"),
    /tidak berlaku/,
  );
  store.getState().acceptInvite(rotated.token, "New Organizer");
  assert.equal(
    store.getState().users.find((user) => user.email === "new@example.com")
      .role,
    "ORGANIZER",
  );
  assert.throws(
    () => store.getState().acceptInvite(rotated.token, "New Organizer"),
    /telah digunakan/,
  );
});
