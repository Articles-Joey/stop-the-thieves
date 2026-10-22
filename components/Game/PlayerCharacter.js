import { Suspense } from "react";
import { ToonCharacter } from "@/components/Models/ToonCharacter";
import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import { useStore } from "@/hooks/useStore";
import { CHARACTER_CENTER_HEIGHT } from "./physics";
import PlayerNickname from "./PlayerNickname";

export default function PlayerCharacter({ action = "Idle", nickname }) {
    const toontownMode = useStore((state) => state.toontownMode);
    const darkMode = useStore((state) => state.darkMode);
    const position = [0, -CHARACTER_CENTER_HEIGHT, 0];

    return (
        <>
            <Suspense fallback={null}>
                {toontownMode ? (
                    <ToonCharacter
                        scale={0.00225}
                        position={position}
                        action={action}
                        isWalking={action === "Walk"}
                        isSprinting={action === "Run"}
                        isJumping={action === "Jump"}
                        brightness={darkMode ? 0.04 : 0.15}
                    />
                ) : (
                    <SpacesuitModel
                        scale={0.75}
                        position={position}
                        action={action}
                    />
                )}
            </Suspense>
            <PlayerNickname nickname={nickname} />
        </>
    );
}
