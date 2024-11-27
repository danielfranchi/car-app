import React from "react";
import { Button as MuiButton } from "@mui/material";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  sx?: object;
}

const Button = ({ children, onClick, type = "button", sx }: ButtonProps) => {
  return (
    <MuiButton
      type={type}
      onClick={onClick}
      fullWidth
      sx={{
        py: 1,
        mt: 2,
        backgroundColor: "#07a776",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        "&:hover": {
          backgroundColor: "#06815a",
        },
        transition: "background-color 0.3s",
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
