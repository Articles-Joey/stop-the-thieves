"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { SHOT_COOLDOWN_MS, SHOOTING_STATUSES } from "./physics";
import styles from "./ShootingReticle.module.css";

export default function ShootingReticle() {
    const lastShotAt = useGameStore(state => state.lastShotAt);
    const showMenu = useStore(state => state.showMenu);
    const status = useGameStore(state => state.gameState.status);
    const reticleRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        let frame;
        const animate = (now) => {
            const progress = lastShotAt === null
                ? 1
                : Math.min(1, Math.max(0, (now - lastShotAt) / SHOT_COOLDOWN_MS));
            ringRef.current?.setAttribute("stroke-dashoffset", String(1 - progress));
            if (reticleRef.current) reticleRef.current.dataset.ready = String(progress === 1);
            if (progress < 1) frame = requestAnimationFrame(animate);
        };
        animate(performance.now());
        return () => cancelAnimationFrame(frame);
    }, [lastShotAt, showMenu]);

    return (
        <div ref={reticleRef} className={styles.reticle} hidden={showMenu || !SHOOTING_STATUSES.includes(status)} aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
                <circle className={styles.track} cx="24" cy="24" r="18" />
                <circle
                    ref={ringRef}
                    className={styles.progress}
                    cx="24"
                    cy="24"
                    r="18"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="0"
                    transform="rotate(-90 24 24)"
                />
                <path className={styles.crosshair} d="M24 13v4m0 14v4M13 24h4m14 0h4" />
                <circle className={styles.dot} cx="24" cy="24" r="2" />
            </svg>
        </div>
    );
}
