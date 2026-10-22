import { Suspense, useEffect, useMemo, useRef } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import { CogCharacter } from "@/components/Models/CogCharacter";
import { CHARACTER_CAPSULE_ARGS, CHARACTER_CENTER_HEIGHT } from "./physics";

export default function SocketEnemies() {
    const enemies = useGameStore((state) => state.gameState.enemies);

    return (
        <group>
            {enemies?.map((player) => (
                <SocketEnemy
                    key={player.id}
                    player={player}
                />
            ))}
        </group>
    );
}

function SocketEnemy({ player }) {
    const ref = useRef(null);
    const toontownMode = useStore((state) => state.toontownMode);
    const userData = useMemo(
        () => ({
            isSocketEnemy: true,
            enemyId: player.id,
            serverId: player.id,
        }),
        [player.id],
    );

    useEffect(() => {
        ref.current?.setNextKinematicTranslation({
            x: player.x || 0,
            y: CHARACTER_CENTER_HEIGHT,
            z: player.z || 0,
        });
    }, [player.x, player.z]);

    return (
        <RigidBody
            ref={ref}
            type="kinematicPosition"
            colliders={false}
            position={[player.x || 0, CHARACTER_CENTER_HEIGHT, player.z || 0]}
            userData={userData}
        >
            <CapsuleCollider
                args={CHARACTER_CAPSULE_ARGS}
                friction={0}
                restitution={0}
            />
            <group
                rotation={[0, player.rotationY || 0, 0]}
                position={[0, -CHARACTER_CENTER_HEIGHT, 0]}
            >
                <Suspense fallback={null}>
                    {toontownMode ? (
                        <CogCharacter
                            scale={0.35}
                            action={player.moving ? "Walk" : "Idle"}
                        />
                    ) : (
                        <SpacesuitModel
                            scale={0.75}
                            action={player.moving ? "Walk" : "Idle"}
                        />
                    )}
                </Suspense>
            </group>
        </RigidBody>
    );
}
