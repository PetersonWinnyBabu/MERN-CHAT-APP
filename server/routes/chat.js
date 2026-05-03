import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
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
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  addMemberValidator,
  getChatDetailsValidator,
  getMessagesValidator,
  leaveGroupValidator,
  newGroupValidator,
  removeMemberValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../lib/validators.js";

const app = express.Router();

//For AUthenticated USer ONLy

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);
app.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMembers
);
app.delete("/leave/:id", leaveGroupValidator(), validateHandler, leaveGroup);

//Send Attachments

app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

//Get Messages

app.get("/message/:id", getMessagesValidator(), validateHandler, getMessages);

//Get Chat Details,rename,delete
app
  .route("/:id")
  .get(getChatDetailsValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(), validateHandler, renameGroup)
  .delete(getChatDetailsValidator(), validateHandler, deleteChat);

export default app;
