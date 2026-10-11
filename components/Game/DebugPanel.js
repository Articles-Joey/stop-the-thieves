"use client";

import Box from "@mui/material/Box";
import { useGameStore } from "@/hooks/useGameStore";

const entrySx = { border: 1, borderColor: "divider", p: "0.5rem" };

export default function DebugPanel() {
    const enemies = useGameStore(state => state.gameState.enemies);
    const barrels = useGameStore(state => state.gameState.barrels);

    return (
        <Box
            className="debug-panel"
            sx={{ mt: "0.5rem", bgcolor: "game.card", border: 1, borderColor: "divider", borderRadius: "0.375rem" }}
        >
            <Box sx={{ p: "1rem" }}>
                <Box sx={{ fontWeight: 700, mb: "0.5rem" }}>Debug</Box>

                <Box>Enemies</Box>
                {enemies?.map((enemy, index) => (
                    <Box key={enemy.id} className="enemy-entry" sx={entrySx}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {enemy.id}</Box>
                        <Box className="player-name" sx={{ display: "flex", alignItems: "center" }}>
                            Thief {index + 1}: {barrels?.some(barrel => barrel.pickedUpBy === enemy.id) ? "Carrying Barrel" : "Seeking Barrel"}
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
                        <Box className="player-name">{barrel.stolen ? "Stolen" : barrel.pickedUp ? "Picked Up" : "On Ground"}</Box>
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
