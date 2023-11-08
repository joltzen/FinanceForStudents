import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Page from "../../components/page";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  return (
    <Page>
      <h1>Profile Page</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <Button variant="contained" color="button" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <p>
          <Button
            variant="contained"
            color="button"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </p>
      )}
    </Page>
  );
}
export default ProfilePage;
