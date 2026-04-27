"use client"
// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
// import { nanoid } from 'nanoid'

// const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
// const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

export const useGameStore = create((set) => ({

    // Mouse and Keyboard
    // Touch
    controlType: "Mouse and Keyboard",
    setControlType: (newValue) => {
        set((prev) => ({
            controlType: newValue
        }))
    },

    action: "Idle",
    setAction: (action) => set({ action }),

    isThirdPerson: false,
    setIsThirdPerson: (isThirdPerson) => set({ isThirdPerson }),

    cameraDistance: 5,
    setCameraDistance: (cameraDistance) => set({ cameraDistance }),

    gameState: {},
    setGameState: (gameState) => set({ gameState }),

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
        }
    ],
    setBarrels: (newValue) => {
        set((prev) => ({
            barrels: newValue
        }))
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
    addProjectile: (projectile) => set((state) => ({
        projectiles: [...state.projectiles, projectile],
    })),
    removeProjectile: (id) => set((state) => ({
        projectiles: state.projectiles.filter((p) => p.id !== id),
    })),
}))