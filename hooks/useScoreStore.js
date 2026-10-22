"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useScoreStore = create(
    persist(
        (set) => ({
            mostRecentScore: null,
            highScore: null,
            // The high score is the smallest total displacement; zero is perfect.
            recordScore: (score) => {
                if (!Number.isFinite(score) || score < 0) return;
                set((state) => ({
                    mostRecentScore: score,
                    highScore:
                        state.highScore === null
                            ? score
                            : Math.min(state.highScore, score),
                }));
            },
        }),
        {
            name: "stop-the-thieves-scores",
            version: 1,
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
            partialize: (state) => ({
                mostRecentScore: state.mostRecentScore,
                highScore: state.highScore,
            }),
        },
    ),
);
