"use client";

import Image from "next/image";
import { useGameStore } from "@/hooks/useGameStore";
import { GAME_DURATION_SECONDS } from "@/gameLogic/singlePlayer/constants";
import styles from "./GameTimer.module.css";

export default function GameTimer() {
    const timer = useGameStore((state) => state.gameState.timer ?? 0);
    const remainingSeconds = Math.max(
        0,
        Math.min(GAME_DURATION_SECONDS, GAME_DURATION_SECONDS - timer),
    );

    return (
        <div
            className={styles.clock}
            role="timer"
            aria-label={`Time remaining: ${remainingSeconds} seconds`}
            aria-live="off"
        >
            <Image
                className={styles.image}
                src="/img/toontown/alarm-clock-filled.webp"
                alt=""
                width={500}
                height={500}
                sizes="123px"
                draggable={false}
            />
            <span
                className={styles.time}
                aria-hidden="true"
            >
                {remainingSeconds}
            </span>
        </div>
    );
}
