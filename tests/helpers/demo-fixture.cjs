const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { webcrypto } = require("node:crypto");

function fixture() {
  const cache = new Map(),
    values = new Map();
  const context = vm.createContext({
    console,
    crypto: webcrypto,
    localStorage: {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
  });
  function load(file) {
    const full = path.resolve(__dirname, "../..", file);
    if (cache.has(full)) return cache.get(full).exports;
    const source = ts.transpileModule(fs.readFileSync(full, "utf8"), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
      },
    }).outputText;
    const module = { exports: {} };
    cache.set(full, module);
    vm.runInContext(`(function(require,module,exports){${source}\n})`, context)(
      (name) => {
        if (name.startsWith("@/")) return load(name.slice(2) + ".ts");
        if (name.startsWith("."))
          return load(path.resolve(path.dirname(full), name + ".ts"));
        return require(name);
      },
      module,
      module.exports,
    );
    return module.exports;
  }
  return {
    store: load("lib/demo/store.ts").useDemoStore,
    model: load("lib/demo/model.ts"),
    storage: values,
  };
}
module.exports = { fixture };
