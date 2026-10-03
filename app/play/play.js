"use client"
import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic'
import Box from '@mui/material/Box';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import LeftPanelContent from '@/components/Game/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import classNames from 'classnames';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

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
    const showMenu = useStore(state => state.showMenu)

    useEffect(() => {

        if (server && socket.connected) {
            const roomName = `game:${process.env.NEXT_PUBLIC_GAME_KEY}-room-${server}`;
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

    const { isFullscreen } = useFullscreen();

    return (

        <Box
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': showMenu,
                    'fullscreen': isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{ position: 'relative', display: 'flex' }}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <Box
                className="canvas-wrap"
                sx={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    '& canvas': {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                    },
                }}
            >

                <GameCanvas
                    key={sceneKey}
                />

            </Box>

        </Box>
    );
}
