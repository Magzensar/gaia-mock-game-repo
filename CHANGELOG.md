# Changelog

## v3.8.0

- tune(boss): TIME_LIMIT 1900 -> 1800
- art(area-5): fix tile seam in row 20
- docs(telemetry): add JSDoc for telemetry.report
- tune(items): ENERGY_GREEN 450 -> 425
- fix(hud): guard next-area banner on the final area
- art(area-2): retile background row 55
- tune(boss): TIME_LIMIT 1800 -> 1700
- docs(enemy_manager): add JSDoc for enemy_manager.hideEnemyShips
- docs(util): add JSDoc for util.hasCollision
- art(area-5): fix tile seam in row 33
- level(area-4): rebalance row 14
- tune(items): ENERGY_RED 600 -> 560
- tune(boss): INITIAL_LIVES 120 -> 136
- docs(player_shot_manager): clarify the shot pool comment
- refactor(weapon): tidy side-shot spawning in fire()
- art(area-4): fix tile seam in row 36
- level(area-4): move missile in row 22
- level(area-0): move boss marker in row 17
- tune(enemy): MAX_ENEMY_SHOTS 16 -> 20
- tune(balance): MAX_DIFFICULTY 344000 -> 352000
- tune(items): ENERGY_GREEN 425 -> 400
- fix(weapon): restore the side-shot cap lost in the fire() tidy-up
- docs(constr-player_item): add JSDoc for PlayerItem.prototype.draw
- docs(player_manager): add JSDoc for player_manager.setup
- tune(items): ENERGY_BLUE 288 -> 304

## v3.7.0

- feat(fx): red damage flash when the player is hit
- tune(items): ENERGY_RED 680 -> 720
- docs(constr-player_shot): add JSDoc for PlayerShot.prototype.draw
- tune(player): THRUST 12 -> 13
- docs(player_shot_manager): add JSDoc for player_shot_manager.fire
- docs(constr-physical_point): add JSDoc for PhysicalPoint.prototype.setAcceleration
- tune(balance): MAX_DIFFICULTY 352000 -> 344000
- tune(items): ENERGY_RED 720 -> 680
- level(area-3): move meteor in row 37
- fix(fx): skip the damage flash when WebGL is unavailable
- docs(util): add JSDoc for util.calcVelocity
- tune(items): ENERGY_GREEN 425 -> 450
- docs(constr-boss): add JSDoc for Boss.prototype.update
- docs(enemy_manager): add JSDoc for enemy_manager.setup
- level(area-7): move fighter in row 29
- feat(hud): warn the player before the next area
- fix(hud): keep LIVES counter clear of the fire button
- level(area-1): shift ship spawn placement (row 29)
- docs(player_shot_manager): add JSDoc for player_shot_manager.setup
- docs(constr-player): add JSDoc for Player.prototype.draw
- tune(items): ENERGY_RED 680 -> 600

## v3.6.0

- tune(items): ENERGY_RED 720 -> 680
- level(area-6): shift boss marker placement (row 27)
- level(area-0): shift fighter placement (row 57)
- level(area-4): shift fighter placement (row 56)
- tune(boss): INITIAL_LIVES 136 -> 120
- tune(enemy): RANDOM_RANGE 304 -> 272
- level(area-0): rebalance row 28
- level(area-1): move meteor in row 37
- docs(boss_manager): add JSDoc for boss_manager.update
- docs(enemy_shot_manager): add JSDoc for enemy_shot_manager.fire
- docs(constr-boss): add JSDoc for Boss
- level(area-6): shift boss marker placement (row 36)
- level(area-6): shift fighter placement (row 26)
- tune(player): BONUS_EVERY 130000 -> 120000
- level(area-3): shift meteor placement (row 16)
- docs(constr-enemy_shot): add JSDoc for EnemyShot
- fix(weapon): cap side shots so spent ones are not kept forever
- docs(constr-tile): add JSDoc for Tile.prototype.draw
- level(area-7): rebalance row 58
- tune(boss): TIME_LIMIT 1800 -> 1900
- docs(constr-background): add JSDoc for Background
- level(area-2): rebalance row 48
- docs(player_manager): note that the player is created lazily
- tune(balance): MAX_DIFFICULTY 344000 -> 352000
- docs(player_item_manager): add JSDoc for player_item_manager.drop
- docs(constr-background): add JSDoc for Background.prototype.scroll

## v3.5.0

- style(ui): rounder dialog buttons
- tune(player): INITIAL_ENERGY_GREEN 180 -> 200
- tune(boss): MAX_HIT 155 -> 165
- style(ui): more spacing between dialog buttons
- fix(telemetry): count unknown enemy kinds instead of throwing
- tune(items): ENERGY_BLUE 256 -> 288
- tune(items): ENERGY_GREEN 375 -> 425
- docs(init): add JSDoc for init
- tune(player): INITIAL_ENERGY_GREEN 200 -> 220
- docs(player_manager): add JSDoc for player_manager.update
- docs(constr-enemy): add JSDoc for Enemy.prototype.draw
- docs(constr-boss): add JSDoc for Boss.prototype.draw
- style(ui): use the system font stack
- tune(enemy): RANDOM_RANGE 288 -> 304
- tune(items): ENERGY_RED 600 -> 680
- docs(player_shot_manager): note why the shot pool is fixed
- feat(weapon): side shots while the plasma cannon is active
- tune(items): ENERGY_RED 680 -> 720
- docs(player_item_manager): add JSDoc for player_item_manager.update

## v3.4.0

- level(area-0): move fighter in row 60
- tune(player): INITIAL_ENERGY_GREEN 200 -> 180
- tune(boss): INITIAL_LIVES 128 -> 136
- art(area-3): retile background row 53
- docs(enemy_shot_manager): add JSDoc for enemy_shot_manager.setup
- feat(fx): soft drop shadows under enemy ships
- docs(enemy_manager): explain enemy_id wrap-around
- level(area-1): shift meteor placement (row 16)
- tune(balance): MAX_DIFFICULTY 336000 -> 344000
- docs(constr-physical_point): add JSDoc for PhysicalPoint.prototype.update
- art(area-1): fix tile seam in row 45
- docs(player_item_manager): add JSDoc for player_item_manager.draw
- perf(fx): remove live shadowBlur from the enemy layer
- tune(items): ENERGY_RED 520 -> 600
- style(ui): darker neutral button for contrast
- tune(enemy): RANDOM_RANGE 272 -> 288
- level(area-3): add a missile wave in row 9
- docs(enemy_manager): explain spawn_counts

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

