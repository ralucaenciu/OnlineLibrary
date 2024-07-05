import { Box, Paper } from "@mui/material";

function PaperCard({ children, style, bg = true, elevation = false, br = 2 }) {
  return (
    <Box
      component={Paper}
      sx={{ p: 2, borderRadius: br, background: bg ? "#EEF0FF" : "" }}
      elevation={elevation ? 3 : 0}
      style={style}
    >
      {children}
    </Box>
  );
}

export default PaperCard;
