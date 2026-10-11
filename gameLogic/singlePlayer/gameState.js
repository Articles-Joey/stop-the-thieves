import { GAME_DURATION_SECONDS, SIMULATION_STEP, getEnemyStage } from "./constants";
import { spawnBarrels, spawnEnemy } from "./spawnHelpers";
import { moveEnemies } from "./enemyHelpers";

export function createSinglePlayerGame(startedAt = null) {
    return {
        status: startedAt === null ? "In Lobby" : "In Progress",
        timer: 0,
        gameStarted: startedAt,
        gameEnded: null,
        lastUpdatedAt: startedAt,
        players: [],
        enemies: startedAt === null ? [] : Array.from({ length: getEnemyStage(0).enemyCount }, spawnEnemy),
        barrels: spawnBarrels(),
    };
}

export function advanceSinglePlayerGame(game, now) {
    if (game.status !== "In Progress") return game;
    const endsAt = game.gameStarted + GAME_DURATION_SECONDS * 1000;
    const updatedAt = Math.max(game.lastUpdatedAt, Math.min(now, endsAt));
    const next = {
        ...game,
        enemies: game.enemies.map(enemy => ({ ...enemy })),
        barrels: game.barrels.map(barrel => ({ ...barrel })),
        lastUpdatedAt: updatedAt,
        timer: Math.min(GAME_DURATION_SECONDS, Math.floor((updatedAt - game.gameStarted) / 1000)),
    };

    // Catch up in small steps after a delayed/background timer, stopping at
    // exactly 60 seconds so a late callback cannot inflate barrel distances.
    let remaining = (updatedAt - game.lastUpdatedAt) / 1000;
    let elapsed = (game.lastUpdatedAt - game.gameStarted) / 1000;
    while (remaining > 0.000001) {
        const stage = getEnemyStage(elapsed);
        addStageEnemies(next, stage);
        // Split at 20s and 40s so delayed callbacks still apply each stage's
        // speed and enemy count only during its own part of the game.
        const step = Math.min(SIMULATION_STEP, remaining, stage.endsAt - elapsed);
        moveEnemies(next, step, stage.speed);
        elapsed += step;
        remaining -= step;
    }
    if (updatedAt < endsAt) {
        addStageEnemies(next, getEnemyStage((updatedAt - game.gameStarted) / 1000));
    }
    if (now >= endsAt) {
        next.status = "Game Over";
        next.gameEnded = endsAt;
        next.enemies.forEach(enemy => { enemy.moving = false; });
    }
    return next;
}

function addStageEnemies(game, stage) {
    while (game.enemies.length < stage.enemyCount) game.enemies.push(spawnEnemy());
}
