import { ENEMY_SPEED } from "./constants";
import { spawnEnemy } from "./spawnHelpers";

export function findNearestUnpickedBarrel(game, enemy) {
    let nearest = null;
    let minDistance = Infinity;
    for (const barrel of game.barrels) {
        if (barrel.pickedUp || barrel.stolen) continue;
        const distance = Math.hypot(barrel.x - enemy.x, barrel.z - enemy.z);
        if (distance < minDistance) {
            nearest = barrel;
            minDistance = distance;
        }
    }
    return nearest;
}

function moveToward(enemy, targetX, targetZ, step) {
    const dx = targetX - enemy.x;
    const dz = targetZ - enemy.z;
    const distance = Math.hypot(dx, dz);
    enemy.moving = distance > 0.0001;
    if (enemy.moving) {
        enemy.rotationY = Math.atan2(dx, dz);
        const fraction = Math.min(1, step / distance);
        enemy.x += dx * fraction;
        enemy.z += dz * fraction;
    }
    return distance <= step;
}

// Mutates only the simulation's copied state, never the store's current state.
export function moveEnemies(game, seconds, speed = ENEMY_SPEED) {
    const step = speed * seconds;
    for (let index = 0; index < game.enemies.length; index++) {
        const enemy = game.enemies[index];
        const carried = game.barrels.find(
            (barrel) => barrel.pickedUpBy === enemy.id,
        );
        if (carried) {
            const reachedExit = moveToward(
                enemy,
                enemy.escapeX,
                enemy.escapeZ,
                step,
            );
            carried.x = enemy.x;
            carried.z = enemy.z;
            if (reachedExit) {
                // Preserve its final position for scoring, but remove this
                // delivered barrel from future targeting and free the thief slot.
                carried.stolen = true;
                carried.pickedUp = false;
                carried.pickedUpBy = null;
                game.enemies[index] = spawnEnemy();
            }
            continue;
        }

        let target = game.barrels.find(
            (barrel) =>
                barrel.id === enemy.targetBarrelId &&
                !barrel.pickedUp &&
                !barrel.stolen,
        );
        if (!target) target = findNearestUnpickedBarrel(game, enemy);
        enemy.targetBarrelId = target?.id ?? null;
        enemy.moving = false;
        if (!target) continue;

        if (moveToward(enemy, target.x, target.z, step)) {
            target.pickedUp = true;
            target.pickedUpBy = enemy.id;
            enemy.targetBarrelId = null;
        }
    }
}

export function resetHitEnemy(game, enemyId) {
    if (
        game.status !== "In Progress" ||
        !game.enemies.some((enemy) => enemy.id === enemyId)
    )
        return game;
    return {
        ...game,
        enemies: game.enemies.map((enemy) =>
            enemy.id === enemyId ? spawnEnemy() : enemy,
        ),
        barrels: game.barrels.map((barrel) =>
            barrel.pickedUpBy === enemyId
                ? { ...barrel, pickedUp: false, pickedUpBy: null }
                : barrel,
        ),
    };
}
