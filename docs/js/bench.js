/*!
 * Name    : bench.js
 * Purpose : Scripted autoplay and frame timing for repro and benchmark runs
 *
 * Usage   : index.html?seed=42&autoplay=1&frames=3000
 *           Prints one line "EAD_BENCH {json}" to the console when done and
 *           stores the same object in window.EAD_BENCH_RESULT.
 *
 * License : MIT License
 */

/*jslint browser, multivar, this*/
/*global EAD, console, performance, window*/

EAD.bench = (function () {
    "use strict";

    var params = new window.URLSearchParams(window.location.search),
        enabled = params.get("autoplay") === "1",
        max_frames = parseInt(params.get("frames") || "3000", 10),
        frame = 0,
        samples = [],
        started_at = performance.now(),
        first_frame_at = 0,
        original_loop = null;

    function percentile(list, p) {
        var sorted = list.slice().sort(function (a, b) {
            return a - b;
        });

        if (!sorted.length) {
            return 0;
        }
        return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
    }

    function report() {
        var result = {
            version: EAD.VERSION,
            seed: EAD.seed,
            frames: frame,
            load_ms: Math.round(first_frame_at - started_at),
            frame_time_ms_p50: percentile(samples, 0.5),
            frame_time_ms_p95: percentile(samples, 0.95),
            frame_time_ms_p99: percentile(samples, 0.99),
            memory_mb: performance.memory
                ? Math.round(performance.memory.usedJSHeapSize / 1048576)
                : null,
            score: EAD.score
        };

        window.EAD_BENCH_RESULT = result;
        console.log("EAD_BENCH " + JSON.stringify(result));
    }

    function drive() {
        // Tap to start, then sweep left and right, firing in bursts.
        if (EAD.game.state === EAD.game.STATE.GAMEOVER) {
            EAD.game.dialog.style.display = "none";
            EAD.game.state = EAD.game.STATE.TITLE;
        }
        EAD.tapped = EAD.game.state === EAD.game.STATE.TITLE;
        EAD.touched = true;
        EAD.prev_x = EAD.curr_x;
        EAD.prev_y = EAD.curr_y;
        EAD.curr_x = EAD.WIDTH / 2 + Math.sin(frame / 25) * (EAD.WIDTH / 3);
        EAD.curr_y = (Math.floor(frame / 10) % 2 === 0)
            ? EAD.HEIGHT - EAD.BASE_PX / 2
            : EAD.HEIGHT - EAD.BASE_PX * 4;
    }

    if (enabled) {
        original_loop = EAD.loop;
        EAD.loop = function () {
            var t0 = performance.now();

            if (!first_frame_at) {
                first_frame_at = t0;
            }
            drive();
            original_loop();
            samples.push(performance.now() - t0);
            frame += 1;
            if (frame === max_frames) {
                report();
            }
        };
    }

    return {enabled: enabled, report: report};
}());
