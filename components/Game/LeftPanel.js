import { memo } from "react";

import ArticlesButton from "@/components/UI/Button";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import GameDetailsPanel from "./GameDetailsPanel";

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';

function LeftPanelContent(props) {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const debug = useStore(state => state.debug);
    const toggleDebug = useStore(state => state.toggleDebug);

    const reloadScene = useStore(state => state.reloadScene);

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <div className="d-flex flex-wrap">

                        <GameMenuPrimaryButtonGroup 
                            useStore={useStore}
                            type="GameMenu"
                        />
    
                        <ArticlesButton
                            small
                            className="w-50"
                            onClick={() => {
                                reloadScene()
                            }}
                        >
                            <span>Reload Game</span>
                        </ArticlesButton>
    
                        <ArticlesButton
                            small
                            className="w-50"
                            onClick={() => {
                                toggleDebug()
                            }}
                            active={debug}
                        >
                            <span>Debug Mode</span>
                        </ArticlesButton>

                    </div>

                </div>
            </div>

            <GameDetailsPanel />

        </div>
    )

}

export default memo(LeftPanelContent)