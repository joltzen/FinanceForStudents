import Page from "../../components/page";
import Text from "../../components/text";
import Heading from "../../components/heading";
import Heading2 from "../../components/heading2";
import strings from "../../config/strings";
import { Typography } from "@mui/material";

function HomePage() {
  return (
    <Page>
      <img
        src="/logos/Logo_stretched.jpg"
        alt="Logo"
        style={{ width: "100%", marginBottom: "20px" }}
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
        <Heading text={strings.homepage.welcomeMessage} />
        <Text text={strings.homepage.what}></Text>
        <Heading2 text={strings.homepage.why}></Heading2>
        <Text text={strings.homepage.explain}></Text>
        <Heading2 text={strings.homepage.how}></Heading2>
        <ul>
          {strings.homepage.how1.map((message, index) => (
            <li key={index}>
              <Text text={message}></Text>
            </li>
          ))}
        </ul>
        <Heading2 text={strings.homepage.securityheading}></Heading2>
        <Text text={strings.homepage.security}></Text>
        <Heading2 text={strings.homepage.goalheading}></Heading2>
        <Text text={strings.homepage.goal}></Text>
        <Typography sx={{ marginTop: 30, color: "#e0e3e9" }}></Typography>
      </div>
    </Page>
  );
}

export default HomePage;
