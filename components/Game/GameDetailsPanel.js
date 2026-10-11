"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UndoIcon from "@mui/icons-material/Undo";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { GAME_DURATION_SECONDS } from "@/gameLogic/singlePlayer/constants";
import { useStartGame } from "@/hooks/useStartGame";
import ArticlesButton from "@articles-media/articles-dev-box/Button";

const entrySx = { border: 1, borderColor: "divider", p: "0.5rem" };

function ReadyBadge({ ready }) {
    return (
        <Chip
            label={ready ? "Ready" : "Not Ready"}
            color={ready ? "success" : "error"}
            size="small"
            sx={{ mr: "0.25rem", height: "auto", fontSize: "0.6rem", fontWeight: 700 }}
        />
    );
}

export default function GameDetailsPanel() {
    const players = useGameStore((state) => state.gameState.players);
    const socket = useSocketStore((state) => state.socket);
    const mode = useGameStore(state => state.gameMode);
    const mostRecentScore = useScoreStore(state => state.mostRecentScore);
    const highScore = useScoreStore(state => state.highScore);
    const status = useGameStore(state => state.gameState.status);
    const connected = useSocketStore(state => state.connected);
    const startGame = useStartGame();
    const canStart = ["In Lobby", "Game Over"].includes(status) && (mode === "singleplayer" || connected);

    return (
        <Box
            className="game-details-panel"
            sx={{ bgcolor: "game.card", border: 1, borderColor: "divider", borderRadius: "0.375rem" }}
        >
            <Box sx={{ p: "1rem" }}>

                <Box sx={{ fontWeight: 700, mb: "0.5rem" }}>{mode === "singleplayer" ? "Single Player" : "Multiplayer"}</Box>

                <ArticlesButton sx={{ width: "100%", mb: "0.5rem" }} onClick={startGame} disabled={!canStart}>
                    {status === "In Progress" ? "Game In Progress" : "Start Game"}
                </ArticlesButton>

                {mode === "multiplayer" && socket?.id}
                <Box sx={{ fontSize: "1rem", fontWeight: 500, mb: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                    <StatusAndTimer />
                </Box>

                {mode === "singleplayer" && <Box sx={{ mb: "1rem", fontSize: "0.875rem" }}>
                    <Box>Barrel Move Distance: {mostRecentScore === null ? "—" : mostRecentScore.toFixed(2)}</Box>
                    <Box>Best: {highScore === null ? "—" : highScore.toFixed(2)} (lower is better)</Box>
                </Box>}

                {mode === "multiplayer" && <Box>Players</Box>}
                {players?.map((player) => (
                    <Box key={player.id} className="player-entry" sx={entrySx}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {player.id}</Box>
                        <Box className="player-name" sx={{ display: "flex", alignItems: "center" }}>
                            <ReadyBadge ready={player.ready} />
                            {player.nickname || "?"}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>X: {player?.position?.[0]?.toFixed(2) || 0} | </Box>
                            <Box>Y: {player?.position?.[1]?.toFixed(2) || 0} | </Box>
                            <Box>Z: {player?.position?.[2]?.toFixed(2) || 0}</Box>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ mr: "0.5rem", display: "flex", alignItems: "center" }}>
                                    <RocketLaunchIcon fontSize="inherit" sx={{ mr: "0.2rem" }} />
                                    {player.hitPower}
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <UndoIcon fontSize="inherit" sx={{ mr: "0.2rem" }} />
                                    {player.hitRotation}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}

            </Box>
        </Box>
    );
}

function StatusAndTimer() {
    const gameState = useGameStore((state) => state.gameState);

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <Box>Game Status: {gameState?.status || "Connecting"}</Box>
            {/* <Box>Time: {gameState?.timer || 0} / {GAME_DURATION_SECONDS}s</Box> */}
        </Box>
    );
}
