/* Copyright (c) 2023, Jason Oltzen */

import { Typography } from "@mui/material";
import Heading from "../../components/heading";
import Heading2 from "../../components/heading2";
import Text from "../../components/text";
import strings from "../../config/strings";

function AboutPage() {
  return (
    <div>
      <img
        src="/logos/Logo_transparant.png"
        alt="Logo"
        style={{ width: "50%", marginBottom: "20px" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginLeft: "5vw",
          marginRight: "5vw",
        }}
      >
        <Heading text="Über uns" />
        <Text text={strings.about.what}></Text>
        <Heading2 text={strings.about.why}></Heading2>
        <Text text={strings.about.explain}></Text>
        <Heading2 text={strings.about.how}></Heading2>
        <ul>
          {strings.about.how1.map((message, index) => (
            <li key={index}>
              <Text text={message}></Text>
            </li>
          ))}
        </ul>
        <Heading2 text={strings.about.securityheading}></Heading2>
        <Text text={strings.about.security}></Text>
        <Heading2 text={strings.about.goalheading}></Heading2>
        <Text text={strings.about.goal}></Text>
        <Typography sx={{ marginTop: 30, color: "#e0e3e9" }}></Typography>
      </div>
    </div>
  );
}

export default AboutPage;
