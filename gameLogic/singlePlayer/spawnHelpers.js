import { BARREL_POSITIONS, ESCAPE_RADIUS, SPAWN_RADIUS } from "./constants";

function makeId() {
    return (
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
    );
}

export function spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    return {
        id: makeId(),
        x: Math.cos(angle) * SPAWN_RADIUS,
        z: Math.sin(angle) * SPAWN_RADIUS,
        escapeX: Math.cos(angle) * ESCAPE_RADIUS,
        escapeZ: Math.sin(angle) * ESCAPE_RADIUS,
        type: "thief",
        targetBarrelId: null,
        rotationY: angle,
        moving: false,
    };
}

export function spawnBarrels() {
    return BARREL_POSITIONS.map((position, index) => ({
        id: `barrel-${index + 1}`,
        ...position,
        startX: position.x,
        startZ: position.z,
        type: "barrel",
        pickedUp: false,
        pickedUpBy: null,
        stolen: false,
    }));
}
