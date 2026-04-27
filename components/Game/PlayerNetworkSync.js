"use client"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSearchParams } from "next/navigation"
import { useGameStore } from "@/hooks/useGameStore"
import { useSocketStore } from "@/hooks/useSocketStore"

const SEND_RATE = 1 / 30; // seconds between sends (30 Hz)

export default function PlayerNetworkSync() {
    const searchParams = useSearchParams();
    const server = searchParams.get("server");

    const position = useGameStore((state) => state.position);
    const action = useGameStore((state) => state.action);
    const modelRotation = useGameStore((state) => state.modelRotation);

    const accumulator = useRef(0);

    useFrame((_, delta) => {
        accumulator.current += delta;
        if (accumulator.current < SEND_RATE) return;
        accumulator.current = 0;

        const socket = useSocketStore.getState().socket;
        if (!socket?.connected) return;

        socket.emit("player_move", {
            position,
            rotation: modelRotation,
            action,
            server,
        });
    });

    return null;
}
