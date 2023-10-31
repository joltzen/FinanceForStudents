import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
}
export default HomePage;
