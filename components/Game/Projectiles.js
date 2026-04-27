"use client"
import { useEffect } from "react"
import { useSphere } from "@react-three/cannon"
import { useGameStore } from "@/hooks/useGameStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation"

const PROJECTILE_TTL = 3000; // ms before auto-remove

// Single physics projectile — removed on collision or TTL expiry
function Projectile({ id, position, velocity }) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const removeProjectile = useGameStore((state) => state.removeProjectile);

    const [ref, api] = useSphere(() => ({
        mass: 0.05,
        type: 'Dynamic',
        args: [0.12],
        position: position,
        // collide with everything except other projectiles (group 8)
        collisionFilterGroup: 8,
        collisionFilterMask: ~8,
        userData: {
            isProjectile: true,
            projectileId: id
        },
        onCollide: (e) => {
            // Ignore own player body so the bullet doesn't self-destruct immediately
            if (e.body.userData.isPlayer) return;

            if (e.body.userData.isSocketEnemy) {

                console.log("HIT SOCKET ENEMY", e.body.userData);

                const socket = useSocketStore.getState().socket;
                socket?.emit('projectile_hit', {
                    enemyId: e.body.userData.enemyId,
                    projectileId: id,
                    server: server
                });
            }

            removeProjectile(id);
        },
    }));

    useEffect(() => {
        api.velocity.set(velocity[0], velocity[1], velocity[2]);

        const timer = setTimeout(() => removeProjectile(id), PROJECTILE_TTL);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial
                color="#ffcc00"
                emissive="#ff6600"
                emissiveIntensity={3}
                toneMapped={false}
            />
        </mesh>
    );
}

export default function Projectiles() {
    const projectiles = useGameStore((state) => state.projectiles);

    return (
        <>
            {projectiles.map((p) => (
                <Projectile key={p.id} {...p} />
            ))}
        </>
    );
}
