import { useFrame, useThree } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"
import { useKeyboard } from "@/hooks/useKeyboard"

import { useGameStore } from "@/hooks/useGameStore"

const JUMP_FORCE = 4;
const SPEED = 4;

export const Player = () => {

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift, crouch } = useKeyboard()

    const { camera } = useThree()

    const [ref, api] = useSphere(() => ({
        mass: 1,
        type: 'Dynamic',
        position: [0, 1, 0],
        userData: {
            isPlayer: true
        },
        onCollide: (e) => {
            
            if(e.body.userData.isEnemy) {

                console.log("isEnemy Collide")

                // api.velocity.set(
                //     0,
                //     2600,
                //     0
                // )

                // api.applyImpulse([0, 500, 0], [0, 0, 0]);

                // api.position.set(
                //     0, 20, 0
                // );

            }
        }
    }))

    const setPlayer = useGameStore((state) => state.setPlayer);
    const setPosition = useGameStore((state) => state.setPosition);
    const position = useGameStore((state) => state.position);

    useEffect(() => {
        // Save ref and api to the store
        setPlayer(ref, api);

        // Subscribe to the position updates
        const unsubscribe = api.position.subscribe((position) => {
            setPosition([...position]); // Update position in the store
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [ref, api, setPlayer, setPosition]);

    const vel = useRef([0, 0, 0])
    useEffect(() => {
        const unsubscribe = api.velocity.subscribe((v) => vel.current = v)
        return () => unsubscribe();
    }, [api.velocity])

    const pos = useRef([0, 0, 0])
    useEffect(() => {
        const unsubscribe = api.position.subscribe((p) => pos.current = p)
        return () => unsubscribe();
    }, [api.position])

    useEffect(() => {
        console.log("Shift", shift)
    }, [shift])

    // useEffect(() => {
    // 	console.log("pos", pos.current)
    // }, [pos.current])

    useFrame(() => {

        // return

        // camera.position.copy(new Vector3(pos.current[0], (pos.current[1] / (crouch ? 2 : 1)), pos.current[2]))

        // Update the camera position using the global state
        camera.position.copy(
            new Vector3(
                position[0],
                position[1] / (crouch ? 2 : 1), // Adjust height for crouch
                position[2]
            )
        );

        // console.log(pos)

        const direction = new Vector3()

        const frontVector = new Vector3(
            0,
            0,
            (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
        )

        const sideVector = new Vector3(
            (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
            0,
            0,
        )

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED * (shift ? 2 : 1))
            .applyEuler(camera.rotation)

        api.velocity.set(direction.x, vel.current[1], direction.z)

        if (jump && Math.abs(vel.current[1]) < 0.05) {
            api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2])
        }

    })

    return (
        <mesh ref={ref}></mesh>
    )
}