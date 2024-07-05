import React from "react";
import { Box } from "@mui/material";

function FlexCenter({ children, style }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
      style={style}
    >
      {children}
    </Box>
  );
}

export default FlexCenter;
