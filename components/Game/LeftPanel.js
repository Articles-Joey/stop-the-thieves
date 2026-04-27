import { memo } from "react";

import Link from "next/link";

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

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

    const debug = useStore(state => state.debug);
    const toggleDebug = useStore(state => state.toggleDebug);

    const darkMode = useStore(state => state.darkMode);
    const toggleDarkMode = useStore(state => state.toggleDarkMode);
    const setShowSettingsModal = useStore(state => state.setShowSettingsModal);

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
                                requestFullscreen()
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
                            toggleDebug()
                        }}
                        active={debug}
                    >
                        <span>Debug Mode</span>
                    </ArticlesButton>

                    <div
                        className="d-flex w-50"
                    >
                        <ArticlesButton
                            small
                            className="w-100"
                            onClick={() => {
                                setShowSettingsModal(true)
                            }}
                        >
                            <i className="fad fa-cog"></i>
                            <span>Settings</span>
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            className=""
                            active={darkMode}
                            onClick={() => {
                                toggleDarkMode()
                            }}
                        >
                            <i className="fad fa-sun"></i>
                        </ArticlesButton>
                    </div>

                </div>
            </div>

        </div>
    )

}

export default memo(LeftPanelContent)