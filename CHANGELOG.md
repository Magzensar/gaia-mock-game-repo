# Changelog

## v3.3.0

- feat(level): track the current area
- docs(game): add JSDoc for loop
- tune(balance): MAX_DIFFICULTY 336000 -> 328000
- feat(tools): headless replay runner and repro options
- art(area-2): retile background row 60
- docs(game): add JSDoc for setup
- level(area-6): move missile in row 46
- feat(debug): ?debug=1 shows seed and area on the HUD
- perf(art): pre-render background tiles at startup
- tune(balance): MAX_DIFFICULTY 328000 -> 336000
- tune(boss): TIME_LIMIT 1600 -> 1800
- docs(enemy_manager): add JSDoc for enemy_manager.update
- tune(enemy): RANDOM_RANGE 256 -> 288
- docs(readme): document seed, autoplay and debug parameters
- docs(enemy_shot_manager): add JSDoc for enemy_shot_manager.update
- perf(art): pre-render only the tiles the maps use
- tune(enemy): RANDOM_RANGE 288 -> 272
- docs(constr-player_item): add JSDoc for PlayerItem.prototype.update
- tune(physics): FRICTION 0.78 -> 0.82
- docs(enemy_manager): add JSDoc for enemy_manager.draw
- feat(telemetry): count enemy spawns by kind for balance reports

## v3.2.0

- tune(physics): FRICTION 0.8 -> 0.78
- tune(items): ENERGY_GREEN 400 -> 375
- tune(boss): MAX_HIT 150 -> 155
- level(area-6): move boss marker in row 36
- docs(constr-enemy_shot): add JSDoc for EnemyShot.prototype.update
- docs(constr-player): add JSDoc for Player
- docs(constr-player): add JSDoc for Player.prototype.update
- refactor(game): clamp difficulty and score with util.clamp
- docs(constr-tile): add JSDoc for Tile
- art(area-3): fix tile seam in row 18
- level(area-4): rebalance row 14
- docs(player_shot_manager): add JSDoc for player_shot_manager.update
- art(area-4): fix tile seam in row 51
- docs(enemy_shot_manager): add JSDoc for enemy_shot_manager.draw
- feat(telemetry): breadcrumbs and crash reporter hook
- tune(player): BONUS_EVERY 100000 -> 110000
- level(area-7): rebalance row 48
- tune(player): BONUS_EVERY 110000 -> 130000
- docs(util): add JSDoc for util.abs
- feat(telemetry): record game start/over and item pickups
- docs(constr-player_shot): add JSDoc for PlayerShot
- tune(items): ENERGY_RED 600 -> 520
- style(ui): smaller button labels on narrow screens

## v3.1.0

- docs(constr-enemy_shot): add JSDoc for EnemyShot.prototype.draw
- chore: adopt EVADE AND DESTROY as the engine base
- feat(engine): seeded RNG so runs can be replayed
- level(area-2): rebalance row 41
- feat(tools): autoplay benchmark mode (?autoplay=1&frames=N)
- ci: add tools/lint.sh syntax check
- level(area-5): shift missile placement (row 16)
- tune(balance): MAX_DIFFICULTY 320000 -> 336000
- chore(pwa): label internal QA builds
- art(area-6): retile background row 35
- feat(util): add padLeft helper for HUD fields
- docs(constr-player_shot): add JSDoc for PlayerShot.prototype.update
- refactor(hud): use padLeft for score, energy and lives

