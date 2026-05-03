import React, { useCallback, useEffect, useMemo } from "react";
import Header from "./Header.jsx";
import Title from "../shared/Title.jsx";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList.jsx";
import { sampleChats } from "../../constants/sampleData.js";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile.jsx";
import { tealColor } from "../../constants/color.js";
import { useMyChatsQuery } from "../../redux/api/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc.js";
import toast from "react-hot-toast";

import { useErrors, useSocketEvents } from "../../hooks/hook.jsx";
import { getSocket } from "../../socket.jsx";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events.js";
import {
  incrementNotificationCount,
  setNewMessagesAlert,
} from "../../redux/reducers/chat.js";
import { getOrSaveFromStorage } from "../../lib/features.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;

    const { isMobile } = useSelector((state) => state.misc);

    const { user } = useSelector((state) => state.auth);

    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery(
      undefined,
      { skip: !user, refetchOnMountOrArgChange: true },
    );

    useErrors([{ isError, error }]);

    // const socket = getSocket();
    const socket = useMemo(() => getSocket(), []);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat", _id, groupChat);
    };

    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    };

    const newMessageAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId],
    );

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, [dispatch]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />

        <Header />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats || []}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              user={user}
            ></ChatList>
          </Drawer>
        )}

        <Grid container height={"calc(100vh - 4rem)"} spacing={0}>
          <Grid
            size={{ sm: 4, md: 3 }}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
            bgcolor={"white"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats || []}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                user={user}
              />
            )}
          </Grid>

          <Grid
            size={{ xs: 12, sm: 8, md: 5, lg: 6 }}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            <WrappedComponent
              {...props}
              socket={socket}
              chatId={chatId}
              user={user}
            />
          </Grid>

          <Grid
            size={{ xs: 0, sm: 0, md: 4, lg: 3 }}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: `${tealColor}`,
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
