"use client"
import { useEffect, useMemo, useRef } from "react";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useSearchParams } from "next/navigation";
import { PROJECTILE_COLLISION_GROUPS, PROJECTILE_TTL_MS } from "./physics";

function Projectile({ id, position, velocity }) {
    const server = useSearchParams().get("server");
    const removeProjectile = useGameStore(state => state.removeProjectile);
    const hasHit = useRef(false);
    const userData = useMemo(() => ({ isProjectile: true, projectileId: id }), [id]);

    const handleHit = ({ other }) => {
        const data = other.rigidBodyObject?.userData;
        if (hasHit.current || data?.isPlayer || data?.isProjectile || data?.isBarrel) return;
        hasHit.current = true;

        if (data?.isSocketEnemy) {
            const game = useGameStore.getState();
            if (game.gameMode === "singleplayer") {
                game.hitSinglePlayerEnemy(data.enemyId);
            } else if (server && game.gameState.status === "In Progress") {
                useSocketStore.getState().socket?.emit("projectile_hit", {
                    enemyId: data.enemyId,
                    projectileId: id,
                    server,
                });
            }
        }
        removeProjectile(id);
    };

    useEffect(() => {
        const timer = setTimeout(() => removeProjectile(id), PROJECTILE_TTL_MS);
        return () => clearTimeout(timer);
    }, [id, removeProjectile]);

    return (
        <RigidBody
            position={position}
            linearVelocity={velocity}
            gravityScale={0}
            ccd
            userData={userData}
            onCollisionEnter={handleHit}
            onIntersectionEnter={handleHit}
        >
            <BallCollider
                args={[0.12]}
                mass={0.05}
                friction={0}
                restitution={0}
                collisionGroups={PROJECTILE_COLLISION_GROUPS}
            />
            <mesh>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial
                    color="#ffcc00"
                    emissive="#ff6600"
                    emissiveIntensity={3}
                    toneMapped={false}
                />
            </mesh>
        </RigidBody>
    );
}

export default function Projectiles() {
    const projectiles = useGameStore(state => state.projectiles);
    return <>{projectiles.map(projectile => <Projectile key={projectile.id} {...projectile} />)}</>;
}
