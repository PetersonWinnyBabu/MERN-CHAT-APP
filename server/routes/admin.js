import express from "express";
import {
  getAllChats,
  getAllUsers,
  getAllMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
} from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/verify", adminLoginValidator(), validateHandler, adminLogin);

app.get("/logout", adminLogout);

//Admin Only Routes
app.use(adminOnly);

app.get("/", getAdminData);
app.get("/users", getAllUsers);
app.get("/chats", getAllChats);
app.get("/messages", getAllMessages);
app.get("/stats", getDashboardStats);

export default app;
