import React from "react";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: "#3b3d49",
};

const Page = ({ children }) => {
  return <div style={containerStyle}>{children}</div>;
};

export default Page;
