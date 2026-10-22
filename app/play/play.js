"use client";
import { useEffect, useRef } from "react";

import { useSearchParams } from "next/navigation";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";

import LeftPanelContent from "@/components/Game/LeftPanel";
import ShootingReticle from "@/components/Game/ShootingReticle";
import EnemyIndicators from "@/components/Game/EnemyIndicators";
import GameTimer from "@/components/Game/GameTimer";
import ScoreModal from "@/components/Game/ScoreModal";
import SinglePlayerGameHandler from "@/components/Handlers/SinglePlayerGameHandler";
import { useGameStore } from "@/hooks/useGameStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

import GameMenu from "@articles-media/articles-dev-box/GameMenu";
import classNames from "classnames";

const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), {
    ssr: false,
});

export default function GamePage() {
    const enemyIndicatorsRef = useRef(null);

    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params;

    const sidebar = useStore((state) => state.sidebar);
    const sceneKey = useStore((state) => state.sceneKey);
    const showMenu = useStore((state) => state.showMenu);
    const nickname = useStore((state) => state.nickname);
    const socket = useSocketStore((state) => state.socket);
    const connected = useSocketStore((state) => state.connected);

    useEffect(() => {
        useGameStore.getState().initializeGame(server);
    }, [server]);

    useEffect(() => {
        if (!server || !connected || !socket?.connected) return;
        const roomName = `game:stop-the-thieves-room-${server}`;
        socket.emit("join-room", roomName, {
            game_id: server,
            nickname,
            client_version: "1",
        });
        return () => {
            if (socket.connected)
                socket.emit("leave-room", roomName, { server_id: server });
        };
    }, [server, connected, socket, nickname]);

    useEffect(() => {
        useScoreStore.persist.rehydrate();
    }, []);

    const { isFullscreen } = useFullscreen();

    return (
        <Box
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    "menu-open": showMenu,
                    fullscreen: isFullscreen,
                    "show-sidebar": sidebar,
                },
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{ position: "relative", display: "flex" }}
        >
            {!server && <SinglePlayerGameHandler />}
            <ScoreModal />

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left",
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <Box
                className="canvas-wrap"
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    "& canvas": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        left: 0,
                        top: 0,
                    },
                }}
            >
                <GameCanvas
                    key={sceneKey}
                    enemyIndicatorsRef={enemyIndicatorsRef}
                />
                <EnemyIndicators ref={enemyIndicatorsRef} />
                <ShootingReticle />
                <GameTimer />
            </Box>
        </Box>
    );
}
