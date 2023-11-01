import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // 100% of the viewport height
      }}
    >
      <h1>Profile Page</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </p>
      )}
    </div>
  );
}
export default ProfilePage;
