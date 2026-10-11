"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import ArticlesModal from "@/components/UI/ArticlesModal";
import { useGameStore } from "@/hooks/useGameStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useStartGame } from "@/hooks/useStartGame";

export default function ScoreModal() {
    const result = useGameStore(state => state.scoreResult);
    const show = useGameStore(state => state.showScoreModal);
    const setShow = useGameStore(state => state.setShowScoreModal);
    const highScore = useScoreStore(state => state.highScore);
    const startGame = useStartGame();

    useEffect(() => {
        if (show && document.pointerLockElement) document.exitPointerLock();
    }, [show]);

    if (!result) return null;
    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="Game Over"
            size="sm"
            action={startGame}
            actionText="Play Again"
            closeText="Close"
        >
            <Box sx={{ mb: "0.5rem" }}>Time is up! Your 60-second game is complete.</Box>
            <Box sx={{ fontSize: "1.4rem", fontWeight: 700, mb: "0.5rem" }}>
                Barrel Move Distance: {result.totalDistance.toFixed(2)}
            </Box>
            <Box sx={{ mb: "1rem" }}>Best: {highScore?.toFixed(2) ?? "—"}. Lower is better; zero is perfect.</Box>
            {result.barrels.map((barrel, index) => (
                <Box key={barrel.id} sx={{ display: "flex", justifyContent: "space-between", py: "0.25rem" }}>
                    <span>Barrel {index + 1}</span>
                    <span>{barrel.distance.toFixed(2)}</span>
                </Box>
            ))}
            <Box sx={{ mt: "1rem", fontSize: "0.875rem", color: "text.secondary" }}>
                Each distance compares the starting and final barrel positions when time runs out.
            </Box>
        </ArticlesModal>
    );
}
