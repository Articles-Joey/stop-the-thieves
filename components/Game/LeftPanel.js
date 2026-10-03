"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";
import GameDetailsPanel from "./GameDetailsPanel";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";

function LeftPanelContent() {
    const debug = useStore((state) => state.debug);
    const toggleDebug = useStore((state) => state.toggleDebug);
    const reloadScene = useStore((state) => state.reloadScene);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ bgcolor: "game.card", border: 1, borderColor: "divider", borderRadius: "0.375rem" }}>
                <Box sx={{ p: "0.5rem" }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" />
                        <ArticlesButton small sx={{ width: "50%" }} onClick={reloadScene}>
                            Reload Game
                        </ArticlesButton>
                        <ArticlesButton small sx={{ width: "50%" }} onClick={toggleDebug} active={debug}>
                            Debug Mode
                        </ArticlesButton>
                    </Box>
                </Box>
            </Box>
            <GameDetailsPanel />
        </Box>
    );
}

export default memo(LeftPanelContent);
