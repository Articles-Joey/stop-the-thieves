// Match the server's layout and duration, reaching its full difficulty at 40s.
export const GAME_DURATION_SECONDS = 60;
export const ENEMY_COUNT = 3;
export const ENEMY_SPEED = 3;
export const ENEMY_STAGES = [
    { endsAt: 20, enemyCount: 1, speed: ENEMY_SPEED * 0.5 },
    { endsAt: 40, enemyCount: 2, speed: ENEMY_SPEED * 0.75 },
    { endsAt: 60, enemyCount: ENEMY_COUNT, speed: ENEMY_SPEED },
];

export function getEnemyStage(elapsedSeconds) {
    return ENEMY_STAGES.find(stage => elapsedSeconds < stage.endsAt) ?? ENEMY_STAGES[ENEMY_STAGES.length - 1];
}
export const SPAWN_RADIUS = 17;
export const ESCAPE_RADIUS = 24;
export const SIMULATION_STEP = 1 / 30;
export const BARREL_POSITIONS = [
    { x: -3, z: -3 },
    { x: 3, z: -3 },
    { x: -3, z: 3 },
    { x: 3, z: 3 },
];
