import { ModelKennyNLFoodBarrel } from "@/components/Models/barrel";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { BARREL_COLLISION_GROUPS } from "./physics";

const BARREL_USER_DATA = { isBarrel: true };

export default function Barrels() {

    const {
        barrels
    } = useGameStore(state => ({
        barrels: state.gameState.barrels,
    }));

    return (
        <group>

            {barrels?.length > 0 && barrels?.map((obj, obj_i) => {
                return (
                    <Barrel
                        key={obj_i}
                        scale={1}
                        obj={obj}
                        position={[
                            obj?.x || 0,
                            0,
                            obj?.z || 0
                        ]}
                    />
                )
            })}

            {/* <Barrel
                scale={1}
                position={[2.5, 0.65, 2.5]}
            />

            <Barrel
                scale={1}
                position={[2.5, 0.65, -2.5]}
            />

            <Barrel
                scale={1}
                position={[-2.5, 0.65, 2.5]}
            />

            <Barrel
                scale={1}
                position={[-2.5, 0.65, -2.5]}
            /> */}

        </group>
    )

}

function Barrel({ obj, position }) {

    const args = [0.25, 0.25, 0.75, 8]

    const ref = useRef(null);

    const toontownMode = useStore(state => state.toontownMode)

    const wallTexture = useTexture("/img/barrel/wall.webp")
    const lidTexture = useTexture("/img/barrel/lid.png")
    const height = obj.pickedUp ? 1.65 : 0.375;

    useEffect(() => {
        ref.current?.setNextKinematicTranslation({
            x: position[0], y: position[1] + height, z: position[2],
        });
    }, [position[0], position[1], position[2], height])

    return (
        <RigidBody
            ref={ref}
            type="kinematicPosition"
            position={[position[0], position[1] + height, position[2]]}
            userData={BARREL_USER_DATA}
        >
            {!obj.pickedUp && <CylinderCollider args={[0.375, 0.25]} collisionGroups={BARREL_COLLISION_GROUPS} sensor />}

            {toontownMode ?
                <mesh>
                    <cylinderGeometry args={args} />
                    <meshStandardMaterial attach="material-0" map={wallTexture} />
                    <meshStandardMaterial attach="material-1" map={lidTexture} />
                    <meshStandardMaterial attach="material-2" map={lidTexture} />
                </mesh>
                :
                <ModelKennyNLFoodBarrel
                    scale={1}
                    position={[0.35, 0.01, 0]}
                    rotation={[0, 0, degToRad(90)]}
                />
            }

        </RigidBody>
    )

}
