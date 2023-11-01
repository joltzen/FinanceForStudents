import React from "react";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
};

const Page = ({ children }) => {
  return <div style={containerStyle}>{children}</div>;
};

export default Page;
