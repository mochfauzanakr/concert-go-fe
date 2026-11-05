const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fixture } = require("../helpers/demo-fixture.cjs");

test("support replies notify the user and resolved conversations reject replies", () => {
  const { store } = fixture();
  const id = store
    .getState()
    .createSupport(
      "Bantuan pesanan",
      "Tiket",
      "",
      "Tolong bantu cek pesanan demo saya.",
    );
  store.getState().replySupport(id, "Kami sedang memeriksanya.", "admin");
  assert.equal(
    store.getState().support.find((item) => item.id === id).status,
    "in_progress",
  );
  assert.equal(
    store.getState().notifications[0].title,
    "Tim bantuan membalas pesanmu",
  );
  store.getState().setSupportStatus(id, "resolved");
  assert.throws(
    () => store.getState().replySupport(id, "Pesan baru", "user"),
    /Buka kembali/,
  );
});
