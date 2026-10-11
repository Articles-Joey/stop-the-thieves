import { memo, Suspense } from "react";

import { Canvas } from "@react-three/fiber"
import { Sky, Stats } from "@react-three/drei";

import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";

import { Player } from "./Player";
import { FPV } from "./FPV";
import Barrels from "./Barrels";
import { PergolaModel } from "./Pergola";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import SocketPlayers from "./SocketPlayers";
import SocketEnemies from "./SocketEnemies";
import { EnemyIndicatorTracker } from "./EnemyIndicators";
import Projectiles from "./Projectiles";
import PlayerNetworkSync from "./PlayerNetworkSync";
import { ModelToontownSkybox } from "../Models/ToontownSkybox";
import GrassPlane from "./GrassPlane";
import GrassArea from "./GrassArea";
import HillsImageRing from "./HillsImageRing";
import FenceImageRing from "./FenceImageRing";
import TreeImageScatter from "./TreeImageScatter";

// An explicit rotation prevents Fiber's default lookAt(0, 0, 0) from
// tilting the camera before the player takes over its position.
const INITIAL_CAMERA = {
    position: [0, 1.3, 0],
    rotation: [0, 0, 0, "YXZ"],
    fov: 50,
};

// const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)
// const GrassPlane = () => {

//     const width = 110; // Set the width of the plane
//     const height = 170; // Set the height of the plane

//     texture.magFilter = NearestFilter;
//     texture.wrapS = RepeatWrapping
//     texture.wrapT = RepeatWrapping
//     texture.repeat.set(5, 5)

//     return (
//         <>
//             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
//                 <planeGeometry attach="geometry" args={[width, height]} />
//                 <meshStandardMaterial attach="material" map={texture} />
//             </mesh>
//         </>
//     );
// };

function GameCanvas({ enemyIndicatorsRef }) {

    // const debugMode = useStore(state => state.debugMode);
    // const toggleDebugMode = useStore(state => state.toggleDebugMode);
    const darkMode = useStore(state => state.darkMode);
    const debug = useStore(state => state.debug);
    const toontownMode = useStore(state => state.toontownMode);
    const gameMode = useGameStore(state => state.gameMode);

    return (
        <Canvas
            camera={INITIAL_CAMERA}
            id="game-canvas"
            shadows
        >

            {/* <OrbitControls
                // autoRotate={gameState?.status == 'In Lobby'}
            /> */}

            {process.env.NODE_ENV === 'development' && <>
                <Stats className="stats-overlay" />
            </>}

            {darkMode ?
                <>
                    <Sky
                        sunPosition={[0, -1, 0]}
                    />
                    <ambientLight intensity={1} />
                </>
                :
                <>
                    <Sky
                        sunPosition={[0, 1, 0]}
                    />
                    <ambientLight intensity={5} />
                </>
            }

            <FPV />

            {toontownMode && 
                <ModelToontownSkybox />
            }

            <FenceImageRing />
            <HillsImageRing />

            <GrassPlane />
            <GrassArea />
            
            {/* <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} /> */}

            <FlatRing
                args={[15, 15.5, 32]}
                color={"white"}
            />

            {/* Pergolas */}
            <group>
                <PergolaModel
                    scale={3}
                    rotation={[0, degToRad(0), 0]}
                />

                <PergolaModel
                    scale={3}
                    rotation={[0, degToRad(90), 0]}
                />

                <PergolaModel
                    scale={3}
                    rotation={[0, degToRad(180), 0]}
                />

                <PergolaModel
                    scale={3}
                    rotation={[0, degToRad(270), 0]}
                />
            </group>

            <Suspense fallback={null}>
                <Physics gravity={[0, -9.81, 0]} colliders={false} debug={debug}>

                    {gameMode === "multiplayer" && <SocketPlayers />}
                    <SocketEnemies />

                    <Barrels />

                    <Player />
                    <EnemyIndicatorTracker indicatorsRef={enemyIndicatorsRef} />

                    {gameMode === "multiplayer" && <PlayerNetworkSync />}

                    <Projectiles />

                    <Ground />

                </Physics>
            </Suspense>

            <Suspense fallback={null}>
                <TreeImageScatter />
            </Suspense>

        </Canvas>
    )
}

export default memo(GameCanvas)

const FlatRing = ({ args, color }) => {
    return (
        <mesh
            rotation={[degToRad(-90), 0, 0]}
            position={[0, 0.01, 0]}
        >
            <ringGeometry args={args} /> {/* Inner radius, outer radius, segments */}
            <meshStandardMaterial color={color} /> {/* side={2} makes it visible on both sides */}
        </mesh>
    );
};

function Ground() {
    return (
        <RigidBody type="fixed" position={[0, -0.25, 0]}>
            <CuboidCollider args={[50, 0.25, 50]} friction={0} restitution={0} />
        </RigidBody>
    )

}
