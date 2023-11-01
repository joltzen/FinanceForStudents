import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Page from "../../components/page";
function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  // Nicht eingeloggter Zustand
  const LoggedOutView = () => (
    <div>
      <img
        src="/logos/Logo_stretched.jpg"
        alt="Logo"
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <Page>
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
    </div>
  );

  // Eingeloggter Zustand
  const LoggedInView = () => (
    <div>
      <img
        src="/logos/Logo_stretched.jpg"
        alt="Logo"
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <Page>
        <h1>Home Page</h1>
        <p>Welcome, {user.username}!</p>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Page>
    </div>
  );

  return <Page>{user ? <LoggedInView /> : <LoggedOutView />}</Page>;
}

export default HomePage;
