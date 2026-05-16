import express from "express";

import { connectDB } from "./utils/features.js";

import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import { errorMiddleware } from "./middlewares/error.js";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";

import { createUser } from "./seeders/user.js";
import {
  createSingleChats,
  createGroupChats,
  createMessages,
  createMessagesInAChat,
} from "./seeders/chat.js";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import corsOptions from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "dshfskhfgsdklfgshfg";

const userSocketIDs = new Map();

connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// createMessagesInAChat("693ae200a924deed602e972c", 50);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello Server");
});

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next),
  );
});

io.on("connection", (socket) => {
  const user = socket.user;

  // console.log("user connected", user);

  userSocketIDs.set(user._id.toString(), socket.id);

  // console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDb = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    // const membersSocket = getSockets(members.map((m) => m._id));
    membersSocket.forEach((socketId) => {
      io.to(socketId).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime,
      });

      io.to(socketId).emit(NEW_MESSAGE_ALERT, {
        chatId,
      });
    });

    console.log("MEMBERS", members);
    console.log("SOCKET IDS", membersSocket);

    try {
      await Message.create(messageForDb);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSocket = getSockets(members);
    membersSocket.forEach((socketId) => {
      socket.to(socketId).emit(START_TYPING, { chatId });
    });
    console.log("typing", members, chatId);
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSocket = getSockets(members);
    membersSocket.forEach((socketId) => {
      socket.to(socketId).emit(STOP_TYPING, { chatId });
    });
    console.log("Stopped Typing", members, chatId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} MODE`);
});

export { envMode, userSocketIDs, adminSecretKey };
