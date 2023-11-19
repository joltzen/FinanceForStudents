import { useTheme } from "@mui/material/styles";
import React from "react";

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
