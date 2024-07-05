import { Button as MdButton } from "@mui/material";

function Button({ text, width, variant, onClick, color, icon, ...rest }) {
  return (
    <MdButton
      variant={variant || "contained"}
      onClick={onClick}
      color={color || "primary"}
      size="large"
      fullWidth
      startIcon={icon ? icon : null}
      style={{ minHeight: 50, width: width }}
      {...rest}
    >
      {text}
    </MdButton>
  );
}

export default Button;
