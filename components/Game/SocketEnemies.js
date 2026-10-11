import { useEffect, useMemo, useRef } from "react";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "@/hooks/useGameStore";
import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";

export default function SocketEnemies() {
    const enemies = useGameStore(state => state.gameState.enemies);

    return (
        <group>
            {enemies?.map(player => (
                <SocketEnemy key={player.id} player={player} />
            ))}
        </group>
    );
}

function SocketEnemy({ player }) {
    const ref = useRef(null);
    const userData = useMemo(() => ({
        isSocketEnemy: true, enemyId: player.id, serverId: player.id,
    }), [player.id]);

    useEffect(() => {
        ref.current?.setNextKinematicTranslation({
            x: player.x || 0, y: 0.75, z: player.z || 0,
        });
    }, [player.x, player.z]);

    return (
        <RigidBody
            ref={ref}
            type="kinematicPosition"
            position={[player.x || 0, 0.75, player.z || 0]}
            userData={userData}
        >
            <BallCollider args={[0.5]} friction={0} restitution={0} />
            <SpacesuitModel
                position={[0, -0.5, 0]}
                rotation={[0, player.rotationY || 0, 0]}
                action={player.moving ? "Walk" : "Idle"}
                scale={0.75}
            />
        </RigidBody>
    );
}
