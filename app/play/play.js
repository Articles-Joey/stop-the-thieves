"use client"
import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic'

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import LeftPanelContent from '@/components/Game/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const game_name = 'Stop the Thieves'
const game_key = 'stop-the-thieves'

export default function GamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const nickname = useStore(state => state.nickname)
    const sidebar = useStore(state => state.sidebar)
    const sceneKey = useStore(state => state.sceneKey)

    useEffect(() => {

        if (server && socket.connected) {
            const roomName = `game:${game_key}-room-${server}`;
            socket.emit('join-room', roomName, {
                game_id: server,
                nickname: nickname,
                client_version: '1',

            });

            return function cleanup() {
                socket.emit('leave-room', roomName)
            };
        }

    }, [server, socket.connected, nickname]);

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    return (

        <div
            className={`${game_key}-game-page ${isFullscreen && 'fullscreen'} ${sidebar && 'show-sidebar'}`}
            id={`${game_key}-game-page`}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}

                // menuBarStyle={"Corner Button"}
                // menuBarButtonPosition={"Left"}

                menuBarConfig={{
                    // style: "Bar",
                    style: "Corner Button",
                    menuBarButtonPosition: "Left",
                    // leftSlotChildren: <>
                    //     123
                    // </>,
                    // centerSlotChildren: <>
                    //     123
                    // </>,
                    // rightSlotChildren: <>
                    //     123
                    // </>,
                }}

                sidebarStyle={"Static Panel"}
            />

            <div className='canvas-wrap'>

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}