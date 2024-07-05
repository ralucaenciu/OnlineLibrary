import React from "react";
import { Box } from "@mui/material";

function FlexCol({ children, style }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
      style={style}
    >
      {children}
    </Box>
  );
}

export default FlexCol;
