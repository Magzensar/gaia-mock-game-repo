/*!
 * Name    : telemetry.js
 * Purpose : Breadcrumbs and crash reporting
 *
 * On Android builds the native shell exposes window.EADNative.reportCrash,
 * which batches reports to the crash backend. Web builds only log locally.
 *
 * License : MIT License
 */

/*jslint browser, multivar, this*/
/*global EAD, console, window*/

EAD.telemetry = {};

EAD.telemetry.MAX_CRUMBS = 20;
EAD.telemetry.crumbs = [];

EAD.telemetry.crumb = function (action) {
    "use strict";

    EAD.telemetry.crumbs.push({t: Date.now(), action: action});
    if (EAD.telemetry.crumbs.length > EAD.telemetry.MAX_CRUMBS) {
        EAD.telemetry.crumbs.shift();
    }
};

EAD.telemetry.report = function (payload) {
    "use strict";

    if (window.EADNative && window.EADNative.reportCrash) {
        window.EADNative.reportCrash(JSON.stringify(payload));
    } else {
        console.warn("EAD crash", payload);
    }
};

window.addEventListener("error", function (evt) {
    "use strict";

    EAD.telemetry.report({
        message: evt.message,
        file: evt.filename,
        line: evt.lineno,
        column: evt.colno,
        stack: evt.error && evt.error.stack,
        version: EAD.VERSION,
        seed: EAD.seed,
        area: EAD.game && EAD.game.area_index,
        crumbs: EAD.telemetry.crumbs.slice()
    });
});
