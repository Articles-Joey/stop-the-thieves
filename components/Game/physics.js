import { interactionGroups } from "@react-three/rapier";

// World objects use Rapier's default group 0. Players and shots use separate
// groups so firing cannot push the player or collide with another projectile.
export const PLAYER_COLLISION_GROUPS = interactionGroups(1, [0, 1, 3]);
export const PROJECTILE_COLLISION_GROUPS = interactionGroups(2, [0]);
// Barrels still detect players, but shots and their aiming rays pass through.
export const BARREL_COLLISION_GROUPS = interactionGroups(3, [0, 1]);

export const SHOT_COOLDOWN_MS = 1000;
export const SHOOTING_STATUSES = ["In Lobby", "In Progress", "Game Over"];
export const PROJECTILE_SPEED = 22;
export const PROJECTILE_TTL_MS = 10000;
export const AIM_DISTANCE = 60;
