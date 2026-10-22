import { useTexture } from "@react-three/drei";
import { DoubleSide } from "three";
import { useStore } from "@/hooks/useStore";
import { NIGHT_SCENERY_TINT } from "./sceneAppearance";

export default function FenceImageRing({
    segments = 64,
    imageHeight = 2.5,
    radius = 25,
}) {
    const texture = useTexture("/img/fenceW_flower.png");
    const darkMode = useStore((state) => state.darkMode);
    // Tangent panels meet at the ring's corners; a little overlap hides seams.
    const segmentWidth = 2 * radius * Math.tan(Math.PI / segments) * 1.02;

    return (
        <group>
            {Array.from({ length: segments }, (_, index) => {
                const angle = (index / segments) * Math.PI * 2;

                return (
                    <mesh
                        key={index}
                        position={[
                            Math.cos(angle) * radius,
                            imageHeight / 2,
                            Math.sin(angle) * radius,
                        ]}
                        rotation={[0, -angle - Math.PI / 2, 0]}
                    >
                        <planeGeometry args={[segmentWidth, imageHeight]} />
                        <meshBasicMaterial
                            map={texture}
                            color={darkMode ? NIGHT_SCENERY_TINT : "white"}
                            side={DoubleSide}
                            alphaTest={0.5}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}
