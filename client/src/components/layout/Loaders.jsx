import React from "react";

import { Grid, Skeleton, Stack } from "@mui/material";
import { BouncingSkeleton } from "../Styles/StyledComponents";

const LayoutLoader = () => {
  return (
    <Grid container height={"calc(100vh - 4rem)"} spacing={0.5}>
      <Grid
        size={{ sm: 4, md: 3 }}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 8, md: 5, lg: 6 }}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        height={"100%"}
      >
        <Stack spacing={1}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={"5rem"} />
          ))}
        </Stack>
      </Grid>

      <Grid
        size={{ xs: 0, sm: 0, md: 4, lg: 3 }}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
    </Grid>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
      />{" "}
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.3s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.5s",
        }}
      />
    </Stack>
  );
};

export { LayoutLoader, TypingLoader };
