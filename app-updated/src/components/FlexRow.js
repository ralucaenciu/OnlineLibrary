import React from "react";
import { Box } from "@mui/material";

function FlexRow({ children, style }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
      }}
      style={style}
    >
      {children}
    </Box>
  );
}

export default FlexRow;
