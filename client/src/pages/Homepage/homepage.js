import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Page from "../../components/page";
import Text from "../../components/text";
import Heading from "../../components/heading";
import Heading2 from "../../components/heading2";
import strings from "../../config/strings";
function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const LoggedOutView = () => (
    <Page>
      <img
        src="/logos/Logo_stretched.jpg"
        alt="Logo"
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <h1>Home Page</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </Button>
    </Page>
  );

  const LoggedInView = () => (
    <Page>
      <img
        src="/logos/Logo_stretched.jpg"
        alt="Logo"
        style={{ width: "100%", marginBottom: "20px" }}
      />
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
    </Page>
  );

  return <Page>{user ? <LoggedInView /> : <LoggedOutView />}</Page>;
}

export default HomePage;
