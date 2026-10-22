"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { addAfterEffect, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { shallow } from "zustand/shallow";
import Box from "@mui/material/Box";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { CHARACTER_CENTER_HEIGHT } from "./physics";

const ENEMY_CENTER_HEIGHT = CHARACTER_CENTER_HEIGHT;
const MARKER_HEIGHT = 2.5;
const EDGE_PADDING = 56;

export function EnemyIndicatorTracker({ indicatorsRef }) {
    const camera = useThree((state) => state.camera);
    const { width, height } = useThree((state) => state.size);

    useEffect(() => {
        const target = new Vector3();
        const cameraSpace = new Vector3();
        const projected = new Vector3();
        const playerPosition = new Vector3();
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const edgeWidth = Math.max(
            1,
            halfWidth - Math.min(EDGE_PADDING, width / 4),
        );
        const edgeHeight = Math.max(
            1,
            halfHeight - Math.min(EDGE_PADDING, height / 4),
        );

        // Run after the player's camera update and rendering, including on respawn.
        return addAfterEffect(() => {
            const indicators = indicatorsRef?.current;
            const overlay = indicators?.overlay.current;
            if (!overlay) return;
            overlay.hidden = useStore.getState().showMenu;
            if (overlay.hidden || width <= 0 || height <= 0) return;

            const { gameState, position } = useGameStore.getState();
            playerPosition.fromArray(position);
            camera.updateMatrixWorld();

            for (const enemy of gameState.enemies ?? []) {
                const marker = indicators.markers.current.get(enemy.id);
                if (!marker) continue;

                target.set(enemy.x ?? 0, ENEMY_CENTER_HEIGHT, enemy.z ?? 0);
                const distance = `${target.distanceTo(playerPosition).toFixed(1)} m`;
                if (marker.distance.textContent !== distance)
                    marker.distance.textContent = distance;

                cameraSpace
                    .copy(target)
                    .applyMatrix4(camera.matrixWorldInverse);
                projected.copy(target).project(camera);
                const inView =
                    cameraSpace.z < -camera.near &&
                    projected.z >= -1 &&
                    projected.z <= 1 &&
                    Math.abs(projected.x) <= 1 &&
                    Math.abs(projected.y) <= 1;

                let x;
                let y;
                if (inView) {
                    target.y = MARKER_HEIGHT;
                    cameraSpace
                        .copy(target)
                        .applyMatrix4(camera.matrixWorldInverse);
                    // If the head anchor crosses the camera, retain the body's projection.
                    if (cameraSpace.z < -camera.near)
                        projected.copy(target).project(camera);
                    x = Math.max(
                        36,
                        Math.min(width - 36, (projected.x + 1) * halfWidth),
                    );
                    y = Math.max(
                        64,
                        Math.min(height - 8, (1 - projected.y) * halfHeight),
                    );
                } else {
                    // Camera-space bearing avoids mirroring left/right for enemies behind us.
                    let dx =
                        cameraSpace.x *
                        camera.projectionMatrix.elements[0] *
                        halfWidth;
                    let dy =
                        -cameraSpace.y *
                        camera.projectionMatrix.elements[5] *
                        halfHeight;
                    if (Math.abs(dx) + Math.abs(dy) < 0.001) {
                        dx = 0;
                        dy = 1;
                    }
                    const scale =
                        1 /
                        Math.max(
                            Math.abs(dx) / edgeWidth,
                            Math.abs(dy) / edgeHeight,
                        );
                    x = halfWidth + dx * scale;
                    y = halfHeight + dy * scale;
                    const length = Math.hypot(dx, dy);
                    marker.root.style.setProperty(
                        "--arrow-x",
                        `${(dx / length) * 32}px`,
                    );
                    marker.root.style.setProperty(
                        "--arrow-y",
                        `${(dy / length) * 32}px`,
                    );
                    marker.root.style.setProperty(
                        "--arrow-angle",
                        `${Math.atan2(dy, dx) + Math.PI / 2}rad`,
                    );
                }

                marker.root.dataset.offscreen = String(!inView);
                marker.root.style.setProperty("--x", `${x}px`);
                marker.root.style.setProperty("--y", `${y}px`);
                marker.root.hidden = false;
            }
        });
    }, [camera, width, height, indicatorsRef]);

    return null;
}

const EnemyIndicators = forwardRef(function EnemyIndicators(props, ref) {
    // Movement updates the DOM each frame; React only updates when enemies change.
    const enemyIds = useGameStore(
        (state) => state.gameState.enemies?.map((enemy) => enemy.id) ?? [],
        shallow,
    );
    const overlayRef = useRef(null);
    const markers = useRef(new Map());
    useImperativeHandle(ref, () => ({ overlay: overlayRef, markers }), []);

    return (
        <Box
            ref={overlayRef}
            aria-hidden="true"
            sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 1,
                "&[hidden]": { display: "none" },
            }}
        >
            {enemyIds.map((id) => (
                <Box
                    key={id}
                    hidden
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "72px",
                        height: "60px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "3px",
                        transform:
                            "translate(var(--x), var(--y)) translate(-50%, -100%)",
                        filter: "drop-shadow(0 2px 3px rgb(0 0 0 / 65%))",
                        "&[hidden]": { display: "none" },
                        '&[data-offscreen="true"]': {
                            transform:
                                "translate(var(--x), var(--y)) translate(-50%, -50%)",
                            "& [data-arrow]": { display: "block" },
                        },
                    }}
                    ref={(node) => {
                        if (node) {
                            markers.current.set(id, {
                                root: node,
                                distance: node.querySelector("[data-distance]"),
                            });
                        } else {
                            markers.current.delete(id);
                        }
                    }}
                >
                    <Box
                        component="svg"
                        viewBox="0 0 28 40"
                        sx={{
                            width: "25px",
                            height: "36px",
                            flexShrink: 0,
                            fill: "#ffe229",
                            stroke: "#dc202b",
                            strokeWidth: 2.5,
                            strokeLinejoin: "round",
                        }}
                    >
                        <path d="M8 3h12l-2 23h-8z" />
                        <circle
                            cx="14"
                            cy="34"
                            r="4"
                        />
                    </Box>
                    <Box
                        component="span"
                        data-distance
                        sx={{
                            padding: "2px 6px",
                            borderRadius: "5px",
                            background: "rgb(20 20 25 / 78%)",
                            color: "white",
                            font: "700 12px/16px system-ui, sans-serif",
                            fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap",
                        }}
                    />
                    <Box
                        component="svg"
                        data-arrow
                        viewBox="0 0 18 12"
                        sx={{
                            display: "none",
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: "18px",
                            height: "12px",
                            fill: "none",
                            stroke: "#ffe229",
                            strokeWidth: 3,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            transform:
                                "translate(var(--arrow-x), var(--arrow-y)) translate(-50%, -50%) rotate(var(--arrow-angle))",
                        }}
                    >
                        <path d="M3 9 9 3l6 6" />
                    </Box>
                </Box>
            ))}
        </Box>
    );
});

export default EnemyIndicators;
