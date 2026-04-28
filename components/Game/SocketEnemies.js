import { useGameStore } from "@/hooks/useGameStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon"
import { Vector3 } from "three"

import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import { degToRad } from "three/src/math/MathUtils.js";

export default function SocketEnemies() {

    const enemies = useGameStore(state => state.gameState.enemies)
    const socket = useSocketStore(state => state.socket)

    const searchParams = useSearchParams()
    const { server } = Object.fromEntries(searchParams.entries())

    return (
        <group>
            {enemies?.length > 0 && enemies?.map((player, index) => (
                <group key={player?.id} position={[0, 0, 0]}>

                    <SocketEnemy
                        position={[player?.x || 0, 0.25, player?.z || 0]}
                        scale={0.75}
                        player={player}
                    />

                </group>
            ))}
        </group>
    )

}

const WALK_SPEED = 1.5; // units per second

function SocketEnemy({
    player
}) {

    const arrived = useRef(false);
    const currentPos = useRef(new Vector3(player?.x || 0, 0.75, player?.z || 0));

    const [ref, api] = useSphere(() => ({
        mass: 0,
        type: 'Kinematic',
        args: [0.5],
        position: [player?.x || 0, 0.75, player?.z || 0],
        userData: { 
            isSocketEnemy: true, 
            enemyId: player?.id,
            serverId: player?.id 
        },
        onCollide: (e) => {
            if (e.body.userData.isProjectile) {
                console.log('[SocketEnemy] Hit by projectile from player');
                // socket?.emit('enemy_hit', {
                //     enemyId: player?.id,
                //     projectileId: e.body.userData.projectileId,
                // });
            }
        },
    }));

    useEffect(() => {
        if (player) {
            api.position.set(player.x || 0, 0.75, player.z || 0)
        }
    }, [player?.x, player?.z, api.position])

    // Walk towards origin on spawn, then stop
    // useFrame((_, delta) => {
    //     if (arrived.current) return;

    //     const target = new Vector3(0, 0.75, 0);
    //     const step = WALK_SPEED * delta;
    //     const remaining = target.distanceTo(currentPos.current);

    //     if (remaining <= step) {
    //         currentPos.current.copy(target);
    //         arrived.current = true;
    //     } else {
    //         const dir = target.clone().sub(currentPos.current).normalize();
    //         currentPos.current.addScaledVector(dir, step);
    //     }

    //     api.position.set(currentPos.current.x, currentPos.current.y, currentPos.current.z);
    // });

    return (
        <group ref={ref}>
            <SpacesuitModel
                position={[0, -0.5, 0]}
                scale={0.75}
            />
        </group>
    )

}