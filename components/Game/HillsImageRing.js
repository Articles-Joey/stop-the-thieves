import { useTexture } from "@react-three/drei";
import { FrontSide } from "three";

export default function HillsImageRing({ segments = 8, imageHeight = 10, radius = 30 }) {
    const images = [
        "/img/BG5_1.png",
        "/img/BG5_2.png",
        "/img/BG5_3.png",
    ];

    const textures = useTexture(images);
    
    // Auto-calculate width to fit the segment size of the circle's circumference
    // (circumference / segments) * a small overlap factor (1.05) to prevent gaps
    const segmentWidth = ((2 * Math.PI * radius) / segments) * 1.1;

    return (
        <group>
            {[...Array(segments)].map((_, index) => {
                const texture = textures[index % textures.length];
                const angle = (index / segments) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                // Draw the transparent backdrop before trees, regardless of camera angle.
                return (
                    <mesh 
                        key={index} 
                        position={[x, imageHeight / 2, z]} 
                        rotation={[0, -angle - Math.PI / 2, 0]}
                        renderOrder={-1}
                    >
                        <planeGeometry args={[segmentWidth, imageHeight]} />
                        <meshBasicMaterial 
                            map={texture} 
                            transparent={true} 
                            side={FrontSide} 
                            depthWrite={false}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}
