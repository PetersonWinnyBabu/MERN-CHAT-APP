import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { Query } from "mongoose";

const newGroupChat = tryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  // if (members.length < 2)
  //   return next(new ErrorHandler("GroupChat Must have atleast 3 members", 400));

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome To ${name} Group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    mesasge: "Group  Created",
  });
});

const getMyChats = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar",
  );

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);

    return {
      _id,
      name: groupChat ? name : otherMember?.name,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      groupChat,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() != req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

const getMyGroups = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));
  return res.status(200).json({
    success: true,
    groups,
  });
});

const addMembers = tryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  // if (!members || members.length < 1)
  //   return next(new ErrorHandler("Please Provide Members", 400));

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("Not a Group Chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Not Authorized", 403));

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100)
    return next(new ErrorHandler("Group members limit reached", 400));

  await chat.save();

  const allUserNames = allNewMembers.map((i) => i.name).join(",");
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUserNames} has been added to the group`,
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members Added Successfully",
  });
});

const removeMembers = tryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("Not a Group Chat", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Not Authorized", 403));
  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have atleast 3 members", 400));

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString(),
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved.name} has been removed from the group`,
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members Removed Successfully",
  });
});

const leaveGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("Not a Group Chat", 400));

  const alternateMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString(),
  );

  if (alternateMembers.length < 3)
    return next(new ErrorHandler("Group must have atleast 3 members", 400));

  if (chat.creator.toString() === req.user.toString()) {
    const randomEl = Math.floor(Math.random() * alternateMembers.length);

    const newCreator = alternateMembers[randomEl];
    chat.creator = newCreator;
  }

  chat.members = alternateMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `User ${user.name} has left the group`);

  return res.status(200).json({
    success: true,
    message: "Members Removed Successfully",
  });
});

const sendAttachments = tryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const files = req.files || [];

  console.log(files);

  if (files.length < 1)
    return next(new ErrorHandler("Please Upload Attachments", 400));
  if (files.length > 5)
    return next(new ErrorHandler("Files cannot be more than 5", 400));

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

  //upload files here

  const attachments = await uploadFilesToCloudinary(files);

  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
    chatId,
  });

  return res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  if (req.query.populate === "true") {
    const chat = await Chat.findById(chatId)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat Not Found", 404));
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("Not a Group Chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Not Authorized", 403));

  chat.name = name;

  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group Name Updated",
  });
});

const deleteChat = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Not Authorized", 403));

  if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(new ErrorHandler("Not Authorized", 403));
  }

  //Deleting All the files related to the chat from cloudinary

  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messagesWithAttachments.forEach(({ attachments }) =>
    attachments.forEach(({ public_id }) => public_ids.push(public_id)),
  );

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat Deleted Successfully",
  });
});

const getMessages = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const { page = 1 } = req.query;

  const resultPerPage = 20;

  const skip = (page - 1) * resultPerPage;

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .populate("sender", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage);

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMembers,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
