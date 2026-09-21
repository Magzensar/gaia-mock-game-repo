#!/usr/bin/env node
/*!
 * Name    : replay.js
 * Purpose : Headless replay of a build: runs docs/js/* in Node with canvas and
 *           DOM stubs and drives EAD.loop() frame by frame. No browser needed.
 *
 * Usage   : node tools/replay.js [--query "?seed=42&autoplay=1"] [--frames 6000]
 *                                [--device mali-g52] [--docs docs]
 *           Prints one line "EAD_REPLAY {json}": frames run, the first uncaught
 *           error (name, message, top frames), the furthest area reached,
 *           player shot count and JS heap use.
 *
 * License : MIT License
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// GPU capability per device family, from the device lab sheet.
const DEVICES = {
    "adreno-610": {webgl: true}, "adreno-630": {webgl: true},
    "adreno-660": {webgl: true}, "adreno-740": {webgl: true},
    "mali-g52": {webgl: true}, "mali-g72": {webgl: true},
    "mali-g78": {webgl: true}, "mali-g715": {webgl: true},
    "powervr-ge8320": {webgl: false}
};

function arg(name, fallback) {
    const i = process.argv.indexOf("--" + name);
    return i > 0 ? process.argv[i + 1] : fallback;
}

const root = path.resolve(__dirname, "..");
const docs = path.resolve(root, arg("docs", "docs"));
const query = arg("query", "?seed=42&autoplay=1&invincible=1");
const frames = parseInt(arg("frames", "6000"), 10);
const device = arg("device", "mali-g52");
const profile = DEVICES[device] || {webgl: true};

const noop = function () {};
const ctx2d = new Proxy({}, {
    get: (t, k) => (k in t ? t[k] : noop),
    set: (t, k, v) => { t[k] = v; return true; }
});
function element() {
    return {
        getContext: (kind) => (kind === "webgl" && !profile.webgl ? null : ctx2d),
        addEventListener: noop, setAttribute: noop, style: {},
        offsetLeft: 0, offsetTop: 0, width: 0, height: 0
    };
}
const store = {};
const sandbox = {
    console, Math, JSON, Date, parseInt, parseFloat, isNaN, Number, String, Array, Object,
    URLSearchParams,
    location: {search: query},
    document: {getElementById: element, createElement: element, addEventListener: noop},
    navigator: {},
    Image: function () { this.src = ""; },
    localStorage: {getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = String(v); }},
    performance: {
        now: () => Number(process.hrtime.bigint()) / 1e6,
        memory: {get usedJSHeapSize() { return process.memoryUsage().heapUsed; }}
    },
    setTimeout: noop, requestAnimationFrame: noop, addEventListener: noop
};
sandbox.window = sandbox;
sandbox.self = sandbox;
vm.createContext(sandbox);

const html = fs.readFileSync(path.join(docs, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="\.\/(js\/[^"]+)"/g)].map((m) => m[1]);
scripts.forEach(function (s) {
    vm.runInContext(fs.readFileSync(path.join(docs, s), "utf8"), sandbox, {filename: s});
});

const out = {device: device, query: query, frames: 0, error: null, max_area_index: 0};
const t0 = sandbox.performance.now();
try {
    sandbox.onload();
    out.onload_ms = Math.round(sandbox.performance.now() - t0);
    const E = sandbox.EAD;
    let f = 0;
    while (f < frames) {
        vm.runInContext("EAD.loop()", sandbox);
        f += 1;
        out.frames = f;
        if (typeof E.game.area_index === "number") {
            out.max_area_index = Math.max(out.max_area_index, E.game.area_index);
        }
    }
} catch (e) {
    out.error = {
        name: e.name,
        message: e.message,
        stack: (e.stack || "").split("\n").filter((l) => /^\s+at /.test(l)).slice(0, 4)
            .map((l) => l.trim())
    };
}
out.player_shots = sandbox.EAD.player_shots ? sandbox.EAD.player_shots.length : null;
out.heap_mb = Math.round(process.memoryUsage().heapUsed / 1048576);
console.log("EAD_REPLAY " + JSON.stringify(out));
