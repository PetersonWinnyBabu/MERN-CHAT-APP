import { useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Avatar,
  IconButton,
  Container,
  Stack,
} from "@mui/material";

import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { Navigate } from "react-router-dom";

const isAdmin = true;

const AdminLogin = () => {
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("SUBMIT");
  };

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #ea4513ff, #f088d1ff)",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography varient="h5">ADMIN LOGIN</Typography>
          <form
            style={{ width: "100%", marginTop: "1rem" }}
            onSubmit={submitHandler}
          >
            <TextField
              required
              fullWidth
              label="SECRET KEY"
              type="password"
              margin="normal"
              varient="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
            />
            <Button
              sx={{ marginTop: "1rem" }}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
