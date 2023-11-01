import React from "react";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  height: "100vh", // 100% of the viewport height
};

const Page = ({ children }) => {
  return <div style={containerStyle}>{children}</div>;
};

export default Page;
