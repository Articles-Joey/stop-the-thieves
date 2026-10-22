import { useRef } from "react";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { Model as ModelKingMen } from "@/components/Models/King";
import { degToRad } from "three/src/math/MathUtils";

export default function Enemies() {
    return (
        <Enemy
            args={[1, 6, 6]}
            position={[0, 1.2, 0]}
        />
    );
}

function Enemy({ args, position, rotation }) {
    const ref = useRef(null);

    const handleIntersection = ({ other }) => {
        if (!other.rigidBodyObject?.userData.isPlayer) return;
        const angle = Math.random() * Math.PI * 2;
        ref.current?.setTranslation(
            {
                x: 16 * Math.cos(angle),
                y: 1.25,
                z: 16 * Math.sin(angle),
            },
            true,
        );
    };

    return (
        <RigidBody
            ref={ref}
            type="fixed"
            position={position}
            rotation={rotation}
            userData={{ isEnemy: true, isHoldingBarrel: false }}
            onIntersectionEnter={handleIntersection}
        >
            <BallCollider
                args={[args[0]]}
                sensor
            />
            <ModelKingMen
                scale={1}
                action="Walk"
                position={[0, -1, 0]}
                rotation={[0, degToRad(90), 0]}
            />
            <mesh castShadow>
                <sphereGeometry args={args} />
                <meshStandardMaterial
                    color="red"
                    transparent
                    opacity={0.25}
                />
            </mesh>
        </RigidBody>
    );
}
