import { ModelKennyNLFoodBarrel } from "@/components/Models/barrel";
import { useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import { useGameStore } from "@/hooks/useGameStore";

export default function Barrels() {

    const {
        barrels
    } = useGameStore(state => ({
        barrels: state.barrels,
    }));

    return (
        <group>

            {barrels.map((obj, obj_i) => {
                return (
                    <Barrel
                        key={obj_i}
                        scale={1}
                        obj={obj}
                        position={obj.position}
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

    const [ref, api] = useSphere(() => ({
        // mass: 0,
        // type: 'Dynamic',
        isTrigger: true,
        args: [0.5, 0.5, 12],
        position: position,
        // rotation: rotation,
        userData: {
            isBarrel: true,
        },
        onCollide: (e) => {
            console.log("Barrel Collide")
        }
    }))

    return (
        <mesh ref={ref}>
            <ModelKennyNLFoodBarrel
                scale={1}
                position={[0.35, 0, 0]}
                rotation={[0, 0, degToRad(90)]}
            />
        </mesh>
    )

}