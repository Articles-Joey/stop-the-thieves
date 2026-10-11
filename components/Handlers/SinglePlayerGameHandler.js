"use client";

import { useEffect } from "react";
import { useGameStore } from "@/hooks/useGameStore";

export default function SinglePlayerGameHandler() {
    useEffect(() => {
        const interval = setInterval(() => useGameStore.getState().tickSinglePlayerGame(), 1000 / 30);
        return () => clearInterval(interval);
    }, []);
    return null;
}
