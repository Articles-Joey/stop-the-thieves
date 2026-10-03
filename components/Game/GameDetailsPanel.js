"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UndoIcon from "@mui/icons-material/Undo";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";

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
    const enemies = useGameStore((state) => state.gameState.enemies);
    const barrels = useGameStore((state) => state.gameState.barrels);
    const socket = useSocketStore((state) => state.socket);

    return (
        <Box
            className="game-details-panel"
            sx={{ bgcolor: "game.card", border: 1, borderColor: "divider", borderRadius: "0.375rem" }}
        >
            <Box sx={{ p: "1rem" }}>
                {socket?.id}
                <Box sx={{ fontSize: "1rem", fontWeight: 500, mb: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                    <RoundAndTimer />
                </Box>

                <Box>Players</Box>
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

                <Box>Enemies</Box>
                {enemies?.map((enemy) => (
                    <Box key={enemy.id} className="enemy-entry" sx={entrySx}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {enemy.id}</Box>
                        <Box className="player-name" sx={{ display: "flex", alignItems: "center" }}>
                            <ReadyBadge ready={enemy.ready} />
                            {enemy.nickname || "?"}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>X: {enemy?.x?.toFixed(2) || 0} | </Box>
                            <Box>Z: {enemy?.z?.toFixed(2) || 0}</Box>
                        </Box>
                    </Box>
                ))}

                <Box>Barrels</Box>
                {barrels?.map((barrel) => (
                    <Box key={barrel.id} className="barrel-entry" sx={entrySx}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {barrel.id}</Box>
                        <Box className="player-name">{barrel.pickedUp ? "Picked Up" : "On Ground"}</Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>X: {barrel?.x?.toFixed(2) || 0} | </Box>
                            <Box>Z: {barrel?.z?.toFixed(2) || 0}</Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

function RoundAndTimer() {
    const gameState = useGameStore((state) => state.gameState);

    return (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <Box>Round: {gameState?.round || 0}</Box>
            <Box>Time: {gameState?.timer || 0}</Box>
        </Box>
    );
}
