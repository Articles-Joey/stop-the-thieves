"use client";
// import { create } from 'zustand'
import { createWithEqualityFn as create } from "zustand/traditional";
import {
    createSinglePlayerGame,
    advanceSinglePlayerGame,
} from "@/gameLogic/singlePlayer/gameState";
import { resetHitEnemy } from "@/gameLogic/singlePlayer/enemyHelpers";
import { calculateBarrelScore } from "@/gameLogic/singlePlayer/score";
import { useScoreStore } from "./useScoreStore";
// import { nanoid } from 'nanoid'

// const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
// const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

export const useGameStore = create((set, get) => ({
    // Mouse and Keyboard
    // Touch
    controlType: "Mouse and Keyboard",
    setControlType: (newValue) => {
        set((prev) => ({
            controlType: newValue,
        }));
    },

    action: "Idle",
    setAction: (action) => set({ action }),

    isThirdPerson: false,
    setIsThirdPerson: (isThirdPerson) => set({ isThirdPerson }),

    cameraDistance: 5,
    setCameraDistance: (cameraDistance) => set({ cameraDistance }),

    gameMode: "singleplayer",
    serverId: null,
    gameState: createSinglePlayerGame(),
    scoreResult: null,
    showScoreModal: false,
    setShowScoreModal: (showScoreModal) => set({ showScoreModal }),
    initializeGame: (serverId) =>
        set({
            gameMode: serverId ? "multiplayer" : "singleplayer",
            serverId: serverId || null,
            gameState: serverId ? {} : createSinglePlayerGame(),
            scoreResult: null,
            showScoreModal: false,
            projectiles: [],
            lastShotAt: null,
        }),
    // Ignore late socket updates after switching to local play.
    setGameState: (gameState) => {
        if (
            get().gameMode === "multiplayer" &&
            String(gameState.server_id ?? gameState.game_id) ===
                String(get().serverId)
        ) {
            set({ gameState });
        }
    },
    startSinglePlayerGame: () => {
        const state = get();
        if (
            state.gameMode !== "singleplayer" ||
            state.gameState.status === "In Progress"
        )
            return false;
        set({
            gameState: createSinglePlayerGame(Date.now()),
            scoreResult: null,
            showScoreModal: false,
            projectiles: [],
            lastShotAt: null,
        });
        return true;
    },
    tickSinglePlayerGame: (now = Date.now()) => {
        const state = get();
        if (
            state.gameMode !== "singleplayer" ||
            state.gameState.status !== "In Progress"
        )
            return;
        const gameState = advanceSinglePlayerGame(state.gameState, now);
        if (gameState.status === "Game Over") {
            const scoreResult = calculateBarrelScore(gameState);
            useScoreStore.getState().recordScore(scoreResult.totalDistance);
            set({ gameState, scoreResult, showScoreModal: true });
        } else {
            set({ gameState });
        }
    },
    hitSinglePlayerEnemy: (enemyId) => {
        // Enforce the deadline even when the timer callback has been delayed.
        get().tickSinglePlayerGame();
        const state = get();
        if (state.gameMode === "singleplayer") {
            set({ gameState: resetHitEnemy(state.gameState, enemyId) });
        }
    },

    barrels: [
        {
            held: false,
            stolen: false,
            position: [2.5, 0.65, 2.5],
        },
        {
            held: false,
            stolen: false,
            position: [2.5, 0.65, -2.5],
        },
        {
            held: false,
            stolen: false,
            position: [-2.5, 0.65, 2.5],
        },
        {
            held: false,
            stolen: false,
            position: [-2.5, 0.65, -2.5],
        },
    ],
    setBarrels: (newValue) => {
        set((prev) => ({
            barrels: newValue,
        }));
    },

    // galleryTheme: "Forest",
    // setGalleryTheme: (newValue) => {
    //     set((prev) => ({
    //         galleryTheme: newValue
    //     }))
    // },

    // music: false,
    // setMusic: (newValue) => {
    //     set((prev) => ({
    //         music: newValue
    //     }))
    // },

    // playerRotation: false,
    // setPlayerRotation: (newValue) => {
    //     set((prev) => ({
    //         playerRotation: newValue
    //     }))
    // },

    // multiplayer: {},
    // setMultiplayer: (newValue) => {
    //     set((prev) => ({
    //         multiplayer: newValue
    //     }))
    // },

    // playerLocation: false,
    // setPlayerLocation: (newValue) => {
    //     set((prev) => ({
    //         playerLocation: newValue
    //     }))
    // },

    ref: null,
    api: null,
    position: [0, 0, 0], // Initial sphere position
    setPlayer: (ref, api) => set({ ref, api }),
    setPosition: (position) => set({ position }),

    modelRotation: [0, 0, 0], // [x, y, z] — model facing direction (not camera)
    setModelRotation: (modelRotation) => set({ modelRotation }),

    tagCounter: 0,
    setTagCounter: (tagCounter) => set({ tagCounter }),

    projectiles: [],
    lastShotAt: null,
    setLastShotAt: (lastShotAt) => set({ lastShotAt }),
    addProjectile: (projectile) =>
        set((state) => ({
            projectiles: [...state.projectiles, projectile],
        })),
    removeProjectile: (id) =>
        set((state) => ({
            projectiles: state.projectiles.filter((p) => p.id !== id),
        })),
}));
