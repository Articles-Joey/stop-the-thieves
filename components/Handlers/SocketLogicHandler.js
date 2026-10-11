"use client";
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from '@/hooks/useStore';
import { useGameStore } from '@/hooks/useGameStore';

import ReusedSocketLogicHandler from '@articles-media/articles-dev-box/ReusedSocketLogicHandler';

export default function SocketLogicHandler() {
    const _hasHydrated = useStore((state) => state._hasHydrated);

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params
    const isSinglePlayer = pathname === '/play' && !server;
    const disconnectSocket = useSocketStore(state => state.disconnectSocket);

    useEffect(() => {
        if (isSinglePlayer) disconnectSocket();
    }, [isSinglePlayer, disconnectSocket]);

    if (!_hasHydrated || isSinglePlayer) return null;

    return <>
        <ReusedSocketLogicHandler
            pathname={pathname}
            useStore={useStore}
            useGameStore={useGameStore}
            useSocketStore={useSocketStore}
            debugConfig={{
                enabled: true,
                // autoHide: true,
                autoHideDelay: 5000,
            }}
            landingConfig={{
                handleLandingDetails: true,
                // onLandingDetails: (data) => {
                //     console.log("[SocketLogicHandler] onLandingDetails", data)
                // }
            }}
            gameConfig={{
                // GamePage owns room membership so leave-room includes the
                // server ID expected by this game's server-side handler.
                handleGameUpdates: false,
                // onGameUpdate: (data) => {
                //     console.log("[SocketLogicHandler] onGameUpdate", data)
                // }
            }}
            server={server}
        />
    </>
}
