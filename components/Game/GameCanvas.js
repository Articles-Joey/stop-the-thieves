import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";

import { Player } from "./Player";
import { FPV } from "./FPV";
import Enemies from "./Enemies";
import Barrels from "./Barrels";
import { PergolaModel } from "./Pergola";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

const GrassPlane = () => {

    const width = 110; // Set the width of the plane
    const height = 170; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </>
    );
};

function GameCanvas(props) {

    return (
        <Canvas camera={{ position: [-10, 40, 40], fov: 50 }}>

            {/* <OrbitControls
                // autoRotate={gameState?.status == 'In Lobby'}
            /> */}

            <Sky
                sunPosition={[0, 10, 0]}
            />

            <FPV />

            <ambientLight intensity={5} />
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

            <Physics>

                <Debug>

                    <Barrels />

                    <Enemies />

                    <Player />

                    <Ground />

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

const FlatRing = ({ args, color }) => {
    return (
        <mesh
            rotation={[degToRad(-90), 0, 0]}
            position={[0, 0.28, 0]}
        >
            <ringGeometry args={args} /> {/* Inner radius, outer radius, segments */}
            <meshStandardMaterial color={color} /> {/* side={2} makes it visible on both sides */}
        </mesh>
    );
};

function Ground() {

    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Static',
        args: [100, 0.5, 100],
        position: [0, 0, 0],
    }))

    const width = 110; // Set the width of the plane
    const height = 170; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[100, 0.5, 100]} />
            {/* <BeachBall /> */}
            {/* <meshStandardMaterial color="#08e8de" /> */}
            <meshStandardMaterial attach="material" map={texture} />
        </mesh>
    )

}