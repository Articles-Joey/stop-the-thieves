"use client";

import { memo, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ViewUserModal from "@/components/UI/ViewUserModal";
import ArticlesDate from "@/components/UI/ArticlesDate";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import useUserFriends from "@/hooks/user/useUserFriends";

function InviteModal({ show, setShow }) {
    const { data: userFriends } = useUserFriends();
    const [friendsSearch, setFriendsSearch] = useState("");
    const [sentMessages, setSentMessages] = useState([]);

    return (
        <ArticlesModal
            show={Boolean(show)}
            setShow={setShow}
            title="Invite Players"
            contentSx={{ p: 0 }}
        >
            {show?.type ? (
                <Box>
                    <Box
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            bgcolor: "background.paper",
                            border: 1,
                            borderColor: "divider",
                            p: "0.5rem",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <TextField
                            label="Friend Search"
                            placeholder="Display name or username"
                            value={friendsSearch}
                            onChange={(event) => setFriendsSearch(event.target.value)}
                            size="small"
                            fullWidth
                            sx={{ maxWidth: 250 }}
                        />
                    </Box>

                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", width: "50%", p: "0.5rem" }}>
                            <Box>Type</Box>
                            <Box sx={{ mb: "0.5rem", fontWeight: 700 }}>{show.type}</Box>
                            <Box>Game Name</Box>
                            <Box sx={{ mb: "0.5rem", fontWeight: 700 }}>{show.game_name}</Box>
                            <Box>Server Id</Box>
                            <Box sx={{ mb: "0.5rem", fontWeight: 700 }}>{show.server_id}</Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "50%",
                                borderLeft: 1,
                                borderColor: "divider",
                                p: "0.5rem",
                            }}
                        >
                            <Box sx={{ color: "text.secondary" }}>Invited Players</Box>
                            <Box className="invited-users">
                                {sentMessages.map((sentMessage) => (
                                    <Box key={sentMessage._id} sx={{ mb: "0.25rem" }}>
                                        <ViewUserModal
                                            user_id={sentMessage.populated_user._id}
                                            populated_user={sentMessage.populated_user}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    <Box className="friends" sx={{ borderTop: 1, borderColor: "divider" }}>
                        {userFriends
                            ?.filter((user) => !friendsSearch || user.populated_user.display_name?.toLowerCase().includes(friendsSearch.toLowerCase()))
                            .map((user) => {
                                const sent = sentMessages.some((message) => message._id === user._id);

                                return (
                                    <Box key={user._id} sx={{ borderBottom: 1, borderColor: "divider", p: "0.5rem" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Box sx={{ ml: "0.5rem" }}>
                                                <ViewUserModal
                                                    user_id={user.populated_user._id}
                                                    populated_user={user.populated_user}
                                                />
                                                <Box sx={{ fontSize: "0.875em" }}>@{user.populated_user.username}</Box>
                                                <Box sx={{ fontSize: "0.875em" }}>
                                                    <Box sx={{ fontSize: "0.875em" }}>
                                                        Added: <ArticlesDate date={user.date} format="PP" />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <ArticlesButton
                                                small
                                                sx={{ ml: "auto" }}
                                                disabled={sent}
                                                onClick={() => setSentMessages((previous) => [
                                                    ...previous,
                                                    { _id: user._id, populated_user: user.populated_user },
                                                ])}
                                            >
                                                {sent ? "Sent" : "Invite"}
                                            </ArticlesButton>
                                        </Box>
                                    </Box>
                                );
                            })}
                    </Box>
                </Box>
            ) : (
                <Box sx={{ p: "1rem" }}>Dev Issue</Box>
            )}
        </ArticlesModal>
    );
}

export default memo(InviteModal);
