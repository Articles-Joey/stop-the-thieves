import { ModelKennyNLFoodBarrel } from "@/components/Models/barrel";
import { useCylinder, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

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

    const [ref, api] = useCylinder(() => ({
        // mass: 0,
        type: 'Kinematic',
        isTrigger: true,
        args: args,
        position: [position[0], position[1] + 0.03, position[2]],
        // rotation: rotation,
        userData: {
            isBarrel: true,
        },
        onCollide: (e) => {
            console.log("Barrel Collide")
        }
    }))

    const toontownMode = useStore(state => state.toontownMode)

    const wallTexture = useTexture("/img/barrel/wall.webp")
    const lidTexture = useTexture("/img/barrel/lid.png")

    const physicsPos = useRef([0, 0, 0])
    useEffect(() => {
        const unsubscribe = api.position.subscribe((v) => {
            physicsPos.current = v
        })
        return unsubscribe
    }, [api.position])

    useFrame(() => {
        if (!ref.current || obj.pickedUp) return;
        ref.current.position.set(physicsPos.current[0], physicsPos.current[1], physicsPos.current[2])
    })

    useEffect(() => {
        if (position) {
            api.position.set(position[0], position[1] + 0.375, position[2])
        }
    }, [position, api.position])

    if (obj.pickedUp) {
        return null
    }

    return (
        <group ref={ref}>

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
                    position={[0, -args[2] / 2, 0]}
                    rotation={[0, 0, degToRad(90)]}
                />
            }

        </group>
    )

}