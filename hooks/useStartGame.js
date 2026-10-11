"use client";

import { useCallback } from "react";
import { useGameStore } from "./useGameStore";
import { useSocketStore } from "./useSocketStore";
import { useStore } from "./useStore";

export function useStartGame() {
    return useCallback(() => {
        const game = useGameStore.getState();
        if (game.gameMode === "singleplayer") {
            if (!game.startSinglePlayerGame()) return;
            useStore.getState().reloadScene();
        } else {
            const socket = useSocketStore.getState().socket;
            if (!socket?.connected || !["In Lobby", "Game Over"].includes(game.gameState.status)) return;
            socket.emit("game:stop-the-thieves:start-game", { server_id: game.serverId });
        }
        useStore.getState().setShowMenu(false);
    }, []);
}
