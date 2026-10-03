"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";
import logo from "../icon.png";

import useUserDetails from "@articles-media/articles-dev-box/useUserDetails";
import useUserToken from "@articles-media/articles-dev-box/useUserToken";
import NicknameInput from "@articles-media/articles-dev-box/NicknameInput";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import SessionButton from "@articles-media/articles-dev-box/SessionButton";

const ReturnToLauncherButton = dynamic(
    () => import("@articles-media/articles-dev-box/ReturnToLauncherButton"),
    { ssr: false },
);
const GameScoreboard = dynamic(
    () => import("@articles-media/articles-dev-box/GameScoreboard"),
    { ssr: false },
);
const Ad = dynamic(() => import("@articles-media/articles-dev-box/Ad"), { ssr: false });

export default function LobbyPage() {
    const darkMode = useStore((state) => state.darkMode);
    const lobbyDetails = useStore((state) => state.lobbyDetails);
    const { data: userToken } = useUserToken(process.env.NEXT_PUBLIC_GAME_PORT);
    const { data: userDetails, isLoading: userDetailsLoading } = useUserDetails({ token: userToken });

    return (
        <Suspense>
            <Box
                className="landing-page"
                sx={{
                    position: "relative",
                    isolation: "isolate",
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    "& .ad-wrap": {
                        mt: "1rem",
                        boxShadow: darkMode ? "0px 0px 34px -10px #a7eefc" : undefined,
                        "@media (min-width: 992px)": {
                            mt: 0,
                            display: "block",
                            position: "absolute",
                            right: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                        },
                    },
                    // Scoreboard and session cards are rendered inside dev-box.
                    "& .card": {
                        boxShadow: darkMode ? "0px 0px 34px -10px #a7eefc" : undefined,
                    },
                }}
            >
                <Box
                    className="background-wrap"
                    sx={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1 }}
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_CDN}games/Stop the Thiefs/cog-thief-toontown-thumbnail.webp`}
                        alt=""
                        fill
                        style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            filter: "blur(10px)",
                            opacity: darkMode ? 0.25 : 1,
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        px: "0.75rem",
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                        justifyContent: "center",
                        alignItems: "center",
                        "@media (min-width: 576px)": { maxWidth: 540 },
                        "@media (min-width: 768px)": { maxWidth: 720 },
                        "@media (min-width: 992px)": { maxWidth: 960, flexDirection: "row" },
                        "@media (min-width: 1200px)": { maxWidth: 1140 },
                        "@media (min-width: 1400px)": { maxWidth: 1320 },
                    }}
                >
                    <Box sx={{ width: "20rem", maxWidth: "100%" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: "1rem" }}>
                            <Image src={logo} alt="Stop the Thieves" width={200} height={200} />
                        </Box>

                        <Box
                            sx={{
                                mb: "1rem",
                                bgcolor: "game.card",
                                color: "text.primary",
                                border: 1,
                                borderColor: "divider",
                                borderRadius: "0.375rem",
                                boxShadow: darkMode ? "0px 0px 34px -10px #a7eefc" : undefined,
                            }}
                        >
                            <Box
                                sx={{
                                    p: "0.5rem",
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <NicknameInput useStore={useStore} />
                            </Box>

                            <Box sx={{ p: "0.5rem" }}>
                                <Link href="/play">
                                    <ArticlesButton small sx={{ width: "100%", mb: "1rem" }}>
                                        <PlayArrowIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                        Play Single Player
                                    </ArticlesButton>
                                </Link>

                                <Box sx={{ fontWeight: 700, mb: "0.25rem", fontSize: "0.875em", textAlign: "center" }}>
                                    {lobbyDetails?.online_player_count || 0} player{lobbyDetails?.online_player_count !== 1 && "s"} in the lobby.
                                </Box>

                                <Box
                                    className="servers"
                                    sx={{ display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
                                >
                                    {[1, 2].map((id) => {
                                        const lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(
                                            (lobby) => parseInt(lobby.server_id) === id,
                                        );

                                        return (
                                            <Box
                                                key={id}
                                                className="server"
                                                sx={{
                                                    p: "0.5rem",
                                                    border: "1px solid rgba(0,0,0,0.25)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        mb: "0.5rem",
                                                    }}
                                                >
                                                    <Box sx={{ fontSize: "0.9rem", fontWeight: 700 }}>Server {id}</Box>
                                                    <Box>{lobbyLookup?.players?.length || 0}/4</Box>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-around",
                                                        width: "100%",
                                                        mb: "0.25rem",
                                                    }}
                                                >
                                                    {[1, 2, 3, 4].map((playerCount) => (
                                                        <Box
                                                            key={playerCount}
                                                            className="icon"
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                bgcolor: lobbyLookup?.players?.length >= playerCount ? "black" : "gray",
                                                                border: "1px solid black",
                                                            }}
                                                        />
                                                    ))}
                                                </Box>

                                                <Link href={{ pathname: "/play", query: { server: id } }}>
                                                    <ArticlesButton small sx={{ px: "3rem" }}>Join</ArticlesButton>
                                                </Link>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    p: "0.5rem",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    borderTop: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <GameMenuPrimaryButtonGroup useStore={useStore} type="Landing" />
                            </Box>
                        </Box>

                        <SessionButton port={process.env.NEXT_PUBLIC_GAME_PORT} friendsButton />
                        <ReturnToLauncherButton />
                    </Box>

                    <GameScoreboard
                        game={process.env.NEXT_PUBLIC_GAME_NAME}
                        style="Default"
                        darkMode={Boolean(darkMode)}
                    />

                    <Ad
                        style="Default"
                        section="Games"
                        section_id={process.env.NEXT_PUBLIC_GAME_NAME}
                        darkMode={Boolean(darkMode)}
                        user_ad_token={userToken}
                        userDetails={userDetails}
                        userDetailsLoading={userDetailsLoading}
                    />
                </Box>
            </Box>
        </Suspense>
    );
}
