export function calculateBarrelScore(game) {
    const barrels = game.barrels.map(barrel => ({
        id: barrel.id,
        distance: Math.hypot(barrel.x - barrel.startX, barrel.z - barrel.startZ),
    }));
    return {
        barrels,
        totalDistance: barrels.reduce((total, barrel) => total + barrel.distance, 0),
    };
}
