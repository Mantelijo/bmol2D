import naviewWasmAsUrl from "../../src/wasm/naview.wasm?url";

Module["locateFile"] = function (path, prefix) {
	return naviewWasmAsUrl;
};

window.Module = Module;
