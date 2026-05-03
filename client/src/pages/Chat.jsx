import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { InputBox } from "../components/Styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import { grayColor, orange } from "../constants/color";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events.js";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { useErrors, useSocketEvents } from "../hooks/hook.jsx";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc.js";
import { removeNewMessagesAlert } from "../redux/reducers/chat.js";
import { TypingLoader } from "../components/layout/Loaders.jsx";

const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [page, setPage] = useState(1);

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);

  const [userTyping, setUserTyping] = useState(false);

  console.log(userTyping, "USertyping");

  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({
    chatId,
    page,
  });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages,
  );

  const errors = [
    {
      isError: chatDetails.isError,
      error: chatDetails.error,
    },
    {
      isError: oldMessagesChunk.isError,
      error: oldMessagesChunk.error,
    },
  ];

  console.log("oldMessages", oldMessages);

  console.log(messages);

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const tempMessage = {
      _id: Date.now(),
      content: message,
      sender: user,
      chatId,
      createdAt: new Date().toISOString(),
    };

    // ✅ instant UI update
    setMessages((prev) => [...prev, tempMessage]);

    //Emmitting message to server

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setPage(1);
      setOldMessages([]);
    };
  }, [chatId]);

  useEffect(() => {
    if (!oldMessages?.length) return;

    setMessages((prev) => {
      // first load
      if (prev.length === 0) return oldMessages;

      // merge without duplicates
      const merged = [...prev];

      oldMessages.forEach((msg) => {
        const exists = merged.find((m) => m._id === msg._id);
        if (!exists) merged.push(msg);
      });

      return merged;
    });
  }, [oldMessages]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const newMessageHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      // setMessages((prev) => [...prev, data.message]);

      setMessages((prev) => {
        const exist = prev.find((m) => m._id === data.message._id);
        if (exist) return prev;
        return [...prev, data.message];
      });
    },
    [chatId],
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId],
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId],
  );

  const eventArr = {
    [NEW_MESSAGE]: newMessageHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventArr);

  useErrors(errors);

  const allMessages = messages;

  // return chatDetails.isLoading ? (
  //   <Skeleton />
  // )

  if (chatDetails.isLoading || oldMessagesChunk.isLoading) return <Skeleton />;

  return (
    <>
      <Stack
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        ref={containerRef}
        height={"90%"}
        bgcolor={grayColor}
        sx={{ overflowX: "hidden", overflowY: "auto" }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
        <div>{userTyping && <TypingLoader />}</div>
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              rotate: "30deg",
              left: "1.5rem",
              position: "absolute",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here.... "
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
