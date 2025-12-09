import { memo } from "react";

import Link from "next/link";

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import useFullscreen from "@/hooks/useFullScreen";

function LeftPanelContent(props) {

    const {
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        reloadScene
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const debugMode = useStore(state => state.debugMode);
    const toggleDebugMode = useStore(state => state.toggleDebugMode);

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <Link
                        href={'/'}
                        className=""
                    >
                        <ArticlesButton
                            className='w-50'
                            small
                        >
                            <i className="fad fa-arrow-alt-square-left"></i>
                            <span>Leave Game</span>
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        small
                        className="w-50"
                        active={isFullscreen}
                        onClick={() => {
                            if (isFullscreen) {
                                exitFullscreen()
                            } else {
                                requestFullscreen('maze-game-page')
                            }
                        }}
                    >
                        {isFullscreen && <span>Exit </span>}
                        {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                        <span>Fullscreen</span>
                    </ArticlesButton>

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
                            toggleDebugMode()
                        }}
                        active={debugMode}
                    >
                        <span>Debug Mode</span>
                    </ArticlesButton>

                </div>
            </div>

        </div>
    )

}

export default memo(LeftPanelContent)