import React from "react";
import { useTheme } from "@mui/material/styles";

const getContainerStyle = (theme) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
});

const Page = ({ children }) => {
  const theme = useTheme();
  const containerStyle = getContainerStyle(theme);

  return <div style={containerStyle}>{children}</div>;
};

export default Page;
