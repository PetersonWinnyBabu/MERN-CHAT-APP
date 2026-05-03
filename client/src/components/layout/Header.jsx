import React, { lazy, Suspense } from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Backdrop,
  Badge,
} from "@mui/material";

import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
} from "@mui/icons-material";

import { orange } from "../../constants/color";
import axios from "axios";
import { server } from "../../constants/config.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExist } from "../../redux/reducers/auth.js";
import {
  setIsMobile,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc.js";
import { resetNotificationCount } from "../../redux/reducers/chat.js";

const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationDialog = lazy(() => import("../specific/Notifications.jsx"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup.jsx"));

const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isSearch, isNotification } = useSelector((state) => state.misc);

  const { notificationCount } = useSelector((state) => state.chat);

  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

  const IconBtn = ({ title, icon, onClick, value }) => {
    return (
      <Tooltip title={title}>
        <IconButton color="inherit" size="large" onClick={onClick}>
          {value ? (
            <Badge badgeContent={value} color="error">
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </IconButton>
      </Tooltip>
    );
  };

  const navigatetoGroups = () => {
    navigate("/groups");
  };
  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearchDialogue = () => dispatch(setIsSearch(true));

  const notificationsHandler = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const openNewGroup = () => {
    setIsNewGroupOpen((prev) => !prev);
    console.log("newGroup");
  };

  const logoutHandler = async () => {
    console.log("logout");
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExist());
      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" sx={{ bgcolor: orange }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Chat App
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn
                title={"Search Users"}
                icon={<SearchIcon />}
                onClick={openSearchDialogue}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigatetoGroups}
              />
              <IconBtn
                title={"Notifications"}
                icon={<NotificationIcon />}
                onClick={notificationsHandler}
                value={notificationCount}
              />

              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open={true} />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open={true} />}>
          <NotificationDialog />
        </Suspense>
      )}

      {isNewGroupOpen && (
        <Suspense fallback={<Backdrop open={true} />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

export default Header;
