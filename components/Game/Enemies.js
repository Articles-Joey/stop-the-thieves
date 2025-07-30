import { memo, useEffect, useRef } from "react";

import { useBox, useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

import { Model as ModelKingMen } from "@/components/Models/King";
import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "three";

export default function Enemies() {
    return (
        <Enemy
            args={[1, 6, 6]}
            position={[0, 1.2, 0]}
        />
    )
}

function getRandomPointOnCircle(radius, center = new Vector3(0, 0, 0)) {
    const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
    const x = center.x + radius * Math.cos(angle);
    const z = center.z + radius * Math.sin(angle); // For a flat XZ plane (3D space)
    return new Vector3(x, center.y, z); // Center.y keeps the height the same
}

function Enemy({ args, position, rotation }) {

    const center = new Vector3(0, 0, 0); // Center of the circle
    const radius = 16;

    const [ref, api] = useSphere(() => ({
        mass: 0,
        // type: 'Dynamic',
        isTrigger: true,
        args: args,
        position: position,
        rotation: rotation,
        userData: {
            isEnemy: true,
            isHoldingBarrel: false
        },
        onCollide: (e) => {
            console.log("Enemy Collide")

            if (e?.body?.userData?.isPlayer) {
                let newPoint = getRandomPointOnCircle(radius, center)
                console.log("reset location", newPoint)
                api.position.set(newPoint.x, 1.25, newPoint.z)
            }
        }
    }))

    const playerModelRef = useRef()

    useEffect(() => {

        api.position.subscribe((p) => {

            if (playerModelRef.current) {
                playerModelRef.current.position.set(...p);
            }

        })

    }, [api.position])

    const moveSpeed = 0.0001; // Change this value to adjust speed
    const amplitude = 15; // Max distance on X-axis

    // Oscillating position logic
    // useFrame(() => {
    //     const time = performance.now();
    //     const oscillation = Math.sin(time * moveSpeed) * amplitude;
    //     api.position.set(oscillation, position[1], position[2]);
    // });

    return (
        <group>

            <group ref={playerModelRef}>
                <ModelKingMen
                    scale={1}
                    action={"Walk"}
                    position={[0, -1, 0]}
                    rotation={[0, degToRad(90), 0]}
                />
            </group>

            <mesh ref={ref} castShadow>
                <sphereGeometry args={args} />
                <meshStandardMaterial
                    color="red"
                    transparent={true}
                    opacity={0.25}
                />
            </mesh>

        </group>
    )

}