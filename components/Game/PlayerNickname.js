import { Suspense } from "react";
import { Billboard, Text } from "@react-three/drei";
import { CHARACTER_CENTER_HEIGHT } from "./physics";

export default function PlayerNickname({ nickname }) {
    const label = nickname?.trim() || "Player";

    return (
        <Suspense fallback={null}>
            <Billboard position={[0, CHARACTER_CENTER_HEIGHT + 0.12, 0]}>
                <Text
                    fontSize={0.12}
                    maxWidth={1.8}
                    textAlign="center"
                    anchorX="center"
                    anchorY="bottom"
                    color="white"
                    outlineColor="black"
                    outlineWidth={0.012}
                    renderOrder={1}
                    material-depthWrite={false}
                    material-toneMapped={false}
                >
                    {label}
                </Text>
            </Billboard>
        </Suspense>
    );
}
