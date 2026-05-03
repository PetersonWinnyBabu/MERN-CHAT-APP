import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { grayColor } from "../../constants/color";

const adminTabs = [
  {
    name: "DashBoard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.56);
  }
`;

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();

  const logoutHandler = () => {
    console.log("logout");
  };

  return (
    <Stack width={w} direction={"column"} p={"2rem"} spacing={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Chat App
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((each) => (
          <Link
            key={each.path}
            to={each.path}
            sx={
              location.pathname === each.path && {
                bgcolor: "black",
                color: "white",
                ":hover": { color: "white" },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {each.icon}
              <Typography>{each.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={logoutHandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const isAdmin = true;

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <>
      <Grid container minHeight={"100vh"}>
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            right: "1rem",
            top: "1rem",
          }}
        >
          <IconButton onClick={handleMobile}>
            {isMobile ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Grid
          item
          size={{
            md: 4,
            lg: 3,
          }}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <Sidebar />
        </Grid>
        <Grid
          item
          size={{
            xs: 12,
            md: 8,
            lg: 9,
          }}
          sx={{
            bgcolor: grayColor,
          }}
        >
          {children}
        </Grid>
        <Drawer open={isMobile} onClose={handleClose}>
          <Sidebar w="50vw" />
        </Drawer>
      </Grid>
    </>
  );
};

export default AdminLayout;
