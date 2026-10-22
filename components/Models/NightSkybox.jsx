import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { BackSide, Color } from "three";

const vertexShader = /* glsl */ `
    varying vec3 vDirection;

    void main() {
        vDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = /* glsl */ `
    uniform vec3 zenithColor;
    uniform vec3 horizonColor;
    varying vec3 vDirection;

    void main() {
        float height = smoothstep(-0.1, 0.85, normalize(vDirection).y);
        gl_FragColor = vec4(mix(horizonColor, zenithColor, height), 1.0);
        #include <colorspace_fragment>
    }
`;

export default function NightSkybox() {
    const group = useRef(null);
    const uniforms = useMemo(
        () => ({
            zenithColor: { value: new Color("#040817") },
            horizonColor: { value: new Color("#17294a") },
        }),
        [],
    );

    useFrame(({ camera }, delta) => {
        if (!group.current) return;
        camera.getWorldPosition(group.current.position);
        group.current.rotation.y =
            (group.current.rotation.y + delta * 0.003) % (Math.PI * 2);
    });

    return (
        // The starfield's group order keeps its transparent points behind hills and trees.
        <group
            ref={group}
            renderOrder={-2}
        >
            <mesh renderOrder={-3}>
                <sphereGeometry args={[450, 32, 16]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    side={BackSide}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
            <Stars
                radius={100}
                depth={120}
                count={3500}
                factor={4}
                saturation={0.1}
                fade
                speed={0.25}
            />
        </group>
    );
}
