/*!
 * Name    : player_shot_manager.js
 * Purpose : Managing the instances of PlayerShot
 *
 * Author  : KUSANAGI Mitsuhisa <mikkun@mbg.nifty.com>
 * License : MIT License
 */

// Continue to use JSLint edition 2017-07-01
/*jslint bitwise, browser, multivar, this*/
/*global EAD, Image, Promise, caches, fetch, self, window*/

EAD.player_shot_manager = {};

// Four shots on screen keeps the pool allocation-free during play.
EAD.player_shot_manager.MAX_PLAYER_SHOTS = 4;

EAD.player_shots = [];

EAD.player_shot_manager.setup = function () {
    "use strict";

    var i = 0;

    while (i < EAD.player_shot_manager.MAX_PLAYER_SHOTS) {
        EAD.player_shots[i] = EAD.player_shots[i] || new EAD.PlayerShot();
        EAD.player_shots[i].state = EAD.player_shots[i].STATE.GARBAGE;

        i += 1;
    }
};

EAD.player_shot_manager.fire = function (energy_red) {
    "use strict";

    var i = 0,
        side_shot = null;

    if (
        energy_red > 0 &&
        EAD.player_shots.length < EAD.player_shot_manager.MAX_PLAYER_SHOTS * 2
    ) {
        side_shot = new EAD.PlayerShot();
        side_shot.fire(energy_red);
        EAD.player_shots.push(side_shot);
    }

    while (i < EAD.player_shot_manager.MAX_PLAYER_SHOTS) {
        if (EAD.player_shots[i].fire(energy_red)) {
            return true;
        }

        i += 1;
    }

    return false;
};

/**
 * Advance the player shot manager by one frame.
 *
 * @param {number} player_x
 * @param {number} player_y
 */
EAD.player_shot_manager.update = function (player_x, player_y) {
    "use strict";

    var i = 0;

    while (i < EAD.player_shots.length) {
        EAD.player_shots[i].update(player_x, player_y);

        i += 1;
    }
};

EAD.player_shot_manager.draw = function () {
    "use strict";

    var i = 0;

    while (i < EAD.player_shots.length) {
        if (EAD.player_shots[i].state !== EAD.player_shots[i].STATE.GARBAGE) {
            EAD.player_shots[i].draw();
        }

        i += 1;
    }
};
