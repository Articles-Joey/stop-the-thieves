import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Image, useTexture } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";
import { useStore } from "@/hooks/useStore";
import { NIGHT_SCENERY_TINT } from "./sceneAppearance";

function scatterValue(seed) {
    const value = Math.sin(seed * 127.1) * 43758.5453;
    return value - Math.floor(value);
}

export default function TreeImageScatter({
    count = 20,
    innerRadius = 25,
    outerRadius = 30,
}) {
    const texture = useTexture("/img/toontown/tree_big.png");
    const darkMode = useStore((state) => state.darkMode);
    const treeRefs = useRef([]);
    const cameraPosition = useMemo(() => new Vector3(), []);
    const aspectRatio = texture.image.width / texture.image.height;
    const trees = useMemo(
        () =>
            Array.from({ length: count }, (_, index) => {
                // Stable variation keeps the scenery in place across renders and restarts.
                const angle =
                    ((index + 0.15 + scatterValue(index + 1) * 0.7) / count) *
                    Math.PI *
                    2;
                const radius =
                    innerRadius +
                    0.75 +
                    scatterValue(index + 31) *
                        (outerRadius - innerRadius - 1.5);
                return {
                    x: Math.cos(angle) * radius,
                    z: Math.sin(angle) * radius,
                    height: 7 + scatterValue(index + 61) * 2.5,
                };
            }),
        [count, innerRadius, outerRadius],
    );

    useFrame(({ camera }) => {
        camera.getWorldPosition(cameraPosition);
        for (const tree of treeRefs.current) {
            if (!tree) continue;
            // A full 360-degree cylindrical billboard: only yaw changes.
            // Facing the camera's position also works when looking back or pitching up.
            tree.rotation.y = Math.atan2(
                cameraPosition.x - tree.position.x,
                cameraPosition.z - tree.position.z,
            );
        }
    });

    return (
        <group>
            {trees.map((tree, index) => (
                <group
                    key={index}
                    ref={(node) => {
                        treeRefs.current[index] = node;
                    }}
                    position={[tree.x, tree.height / 2 + 0.02, tree.z]}
                >
                    <Image
                        texture={texture}
                        color={darkMode ? NIGHT_SCENERY_TINT : "white"}
                        scale={[tree.height * aspectRatio, tree.height]}
                        transparent
                        side={DoubleSide}
                        toneMapped={false}
                        onUpdate={(mesh) => {
                            mesh.material.depthWrite = false;
                        }}
                    />
                </group>
            ))}
        </group>
    );
}
