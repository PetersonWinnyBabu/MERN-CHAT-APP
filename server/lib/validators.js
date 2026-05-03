import { body, validationResult, check, param, query } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  console.log(errorMessages);

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessages, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),

  body("username", "Please Enter UserName").notEmpty(),

  body("bio", "Please Enter Bio").notEmpty(),

  body("password", "Please Enter Password").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please Enter UserName").notEmpty(),

  body("password", "Please Enter Password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Please Enter Name").notEmpty(),

  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be between 2 and 100"),
];

const addMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),

  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be between 1 and 97"),
];

const removeMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),

  body("userId", "Please Enter User ID").notEmpty(),
];

const leaveGroupValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
];

const getMessagesValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
];

const getChatDetailsValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
];
const renameGroupValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
  body("name", "Please Enter New Name").notEmpty(),
];

const sendRequestValidator = () => [
  body("userId", "Please Enter User ID").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please Enter Request ID").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean value"),
];

const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
];

export {
  registerValidator,
  validateHandler,
  loginValidator,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  leaveGroupValidator,
  sendAttachmentsValidator,
  getMessagesValidator,
  getChatDetailsValidator,
  renameGroupValidator,
  sendRequestValidator,
  acceptRequestValidator,
  adminLoginValidator,
};

// check("avatar", "Please Upload Avatar").notEmpty(),
